import React from 'react';
import { ethers } from 'ethers';
import { useWallet } from 'use-wallet';
import { WindowsContext } from '../../contexts/Windows';
import { errors } from '../../helpers';
import {
  useUserApprovalOfContract,
  useUserTokenBalance,
  useYam
} from '../../hooks';
import { ErrorType } from '../../contexts/Windows/WindowsProvider';
import { DATA_UNAVAILABLE } from '../../config';

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
  ...props
}) => {
  textApprove = textApprove || 'Approve';
  textLoading = textLoading || 'Loading...';
  textApproving = textApproving || 'Approving...';
  allowanceRequiredFor = allowanceRequiredFor || {
    contract: undefined,
    token: undefined
  };

  const yam = useYam();
  const wallet = useWallet();
  const windowsContext = React.useContext(WindowsContext);
  const [loading, setLoading] = React.useState(false);
  const tokenBalance = useUserTokenBalance(allowanceRequiredFor.token);
  const approval = useUserApprovalOfContract(
    allowanceRequiredFor.contract,
    allowanceRequiredFor.token
  );
  const [allowanceSatisfied, setAlowanceSatisfied] = React.useState(
    allowanceRequiredFor.contract === undefined
  );
  const [initialized, setInitialized] = React.useState(
    allowanceRequiredFor.contract === undefined
  );

  /*
   * TODO: This is not bullet proof has the approval balance can be evaluated
   * before or after the token balancer is updated.
   */
  React.useEffect(() => {
    setAlowanceSatisfied(
      !allowanceRequiredFor.contract ||
      (approval.amount !== DATA_UNAVAILABLE &&
        tokenBalance.balance !== DATA_UNAVAILABLE &&
        approval.amount.gte(tokenBalance.balance))
    );

    setInitialized(true);
  }, [approval.amount, tokenBalance.balance]);

  const isDisabled = () => {
    return !yam || !initialized || loading || !!props.disabled
      ? 'disabled'
      : '';
  };

  const handleApproval = async () => {
    setLoading(true);

    try {
      const contract = yam.contracts[allowanceRequiredFor.contract]._address;
      const transaction = yam.contracts[
        allowanceRequiredFor.token
      ].methods.approve(contract, ethers.constants.MaxUint256);
      const gasEstimation = await transaction.estimateGas({
        from: wallet.account
      });

      await transaction.send({
        from: wallet.account,
        gasEstimation
      });
    } catch (error) {
      const transactionError = errors.getTransactionError(error);
      windowsContext.showError(
        'Error while approving',
        '',
        ErrorType.Fatal,
        transactionError.message
      );
    } finally {
      setLoading(false);
      tokenBalance.refresh();
      approval.refresh();
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
      return (
        <span>
          {allowanceSatisfied ? textLoading : textApproving}{' '}
          <Hourglass size={20} />
        </span>
      );
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
    <Button
      {...props}
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
    </Button>
  );
};

export default TransactionButton;
