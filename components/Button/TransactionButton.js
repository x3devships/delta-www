import { ethers } from 'ethers';
import { useWallet } from 'use-wallet';
import { useContext, useEffect, useState } from 'react';
import { errors } from '../../helpers';
import { useUserApprovalOfContract, useTokenBalance, useYam } from '../../hooks';
import { DATA_UNAVAILABLE } from '../../config';
import { ModalContext } from '../../contexts';
import DeltaButton from './DeltaButton';
import { Spinner } from '../Spinner';

/**
 * A button that supports sending a transaction and keeping track of allowance/approval
 * if allowanceRequiredFor is specified with the contract and token name.
 */
const TransactionButton = ({
  onClick,
  allowanceRequiredFor,
  icon,
  text,
  textLoading,
  textApprove,
  textApproving,
  approvingTx,
  secondaryLooks,
  className,
  ...props }) => {

  textApprove = textApprove || 'Approve';
  textLoading = textLoading || 'Loading...';
  textApproving = textApproving || 'Approving...';
  approvingTx = approvingTx || 'Approving Transaction...';
  allowanceRequiredFor = allowanceRequiredFor || {
    contract: undefined,
    token: undefined
  };

  const yam = useYam();
  const wallet = useWallet();
  const modalContext = useContext(ModalContext);
  const [loading, setLoading] = useState(false);
  const tokenBalance = useTokenBalance(allowanceRequiredFor.token);
  const approval = useUserApprovalOfContract(allowanceRequiredFor.contract, allowanceRequiredFor.token);
  const [allowanceSatisfied, setAlowanceSatisfied] = useState(allowanceRequiredFor.contract === undefined);
  const [initialized, setInitialized] = useState(allowanceRequiredFor.contract === undefined);

  /*
   * TODO: This is not bullet proof has the approval balance can be evaluated
   * before or after the token balancer is updated.
   */
  useEffect(() => {
    setAlowanceSatisfied(
      !allowanceRequiredFor.contract || (approval.amount !== DATA_UNAVAILABLE && tokenBalance.balance !== DATA_UNAVAILABLE && approval.amount.gte(tokenBalance.balance))
    );

    setInitialized(true);
  }, [approval.amount, tokenBalance.balance]);

  const isDisabled = () => {
    return (!yam || !initialized || loading || props.disabled === true) ? 'disabled' : '';
  };

  const handleApproval = async () => {
    setLoading(true);

    try {
      const contract = yam.contracts[allowanceRequiredFor.contract]._address;
      const transaction = yam.contracts[allowanceRequiredFor.token].methods.approve(contract, ethers.constants.MaxUint256);

      // Approving message
      const approveTx = await modalContext.showControlledMessage("Approving", <Spinner label={approvingTx} />);

      const gasEstimation = await transaction.estimateGas({
        from: wallet.account
      });

      await transaction.send({
        from: wallet.account,
        gasEstimation
      });

      approveTx.close();
    } catch (error) {
      const transactionError = errors.getTransactionError(error);
      modalContext.showError('Error while approving', transactionError.message);
    } finally {
      setLoading(false);
      tokenBalance.update();
      approval.update();
    }
  };

  const handleTransaction = async () => {
    if (!onClick) {
      throw new Error('An onClick property must be provided.');
    }

    setLoading(true);

    try {
      await onClick();
    } finally {
      setLoading(false);
    }
  };

  const renderButtonText = () => {
    if (loading) {
      return <span>{allowanceSatisfied ? textLoading : textApproving}</span>;
    }

    if (icon) {
      return (
        <>
          <img src={icon} alt="icon" style={{ marginRight: '0.5em' }} />
          {allowanceSatisfied ? text : textApprove}
        </>
      );
    }

    return <>{allowanceSatisfied ? text : textApprove}</>;
  };

  return (
    <DeltaButton
      {...props}
      className={className}
      disabled={isDisabled()}
      onClick={() => {
        if (allowanceSatisfied) {
          handleTransaction();
        } else {
          handleApproval();
        }
      }}
    >
      {renderButtonText()}
    </DeltaButton>
  );
};

export default TransactionButton;
