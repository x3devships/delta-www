/* eslint-disable react/no-danger */
import { useWallet } from 'use-wallet';
import { useContext } from 'react';
import { ProgressBarCountDown } from '../ProgressBar';
import { errors, formatting } from '../../helpers';
import { DeltaPanel, DeltaSection, DeltaSectionBlock } from '../Section';
import { useYam } from '../../hooks';
import TransactionButton from '../Button/TransactionButton';
import { ModalContext } from '../../contexts';
import { Spinner } from '../Spinner';
import { GlobalHooksContext } from '../../contexts/GlobalHooks';

const Staking = () => {
  const yam = useYam();
  const wallet = useWallet();
  const globalHooks = useContext(GlobalHooksContext);
  const modalContext = useContext(ModalContext);

  const onClaim = async stake => {
    const claimToWallet = !stake;
    const transaction = await yam.contracts.LSW.methods.claimOrStakeAndClaimLP(claimToWallet);

    try {
      const transactionGasEstimate = await transaction.estimateGas({ from: wallet.account });
      const transactionTitle = stake ? 'Claiming and staking...' : 'Claiming...';
      const successMessage = stake ?
        'Your rLP tokens have been claimed and staked. You can see them displayed on the main page' :
        'Your rLP tokens have been claimed and there are now available in your wallet';

      const transactionMessage = modalContext.showControlledMessage(transactionTitle, <Spinner label="Transaction in progress..." />);

      await transaction.send({
        from: wallet.account,
        gas: transactionGasEstimate
      });

      transactionMessage.close();

      globalHooks.lswStats.update();
      await modalContext.showMessage('Success', <>
        <div className="text-lg">{successMessage}</div>
      </>)

    } catch (error) {
      const decodedError = errors.getTransactionError(error, 'An error occured while claiming');
      console.log(decodedError);
      return modalContext.showError('Claiming Error', decodedError.message);
    }

    return Promise.resolve();
  };

  return <DeltaSection center title="Limited Staking Window is closed">
    <DeltaPanel>
      <ProgressBarCountDown />
      <div className="text-center mt-6">{Math.round(globalHooks.lswStats.data.totalEthContributed).toFixed(0).toLocaleString()} ETH contributed!</div>
    </DeltaPanel>
    <DeltaSectionBlock requiresConnectedWallet>
      <ul className="list-disc list-inside py-4">
        <li>You Contributed: {formatting.getTokenAmount(globalHooks.lswStats.data.accountContributedEth, 0, 6)} ETH</li>
        <li>rLP to be claimed: {formatting.getTokenAmount(globalHooks.lswStats.data.claimableRlp, 0, 6)} rLP</li>
      </ul>
      <DeltaPanel className="flex items-center text-center flex-wrap">
        <TransactionButton className="flex-1 mr-2 md:mr-0 md:flex-grow-0" text="Claim &amp; Stake" textLoading="Staking..." onClick={() => onClaim(true)} />
        <TransactionButton className="flex-1 ml-2 md:ml-4 md:flex-grow-0" text="Claim" textLoading="Claiming..." onClick={() => onClaim(false)} />
      </DeltaPanel>
    </DeltaSectionBlock>
  </DeltaSection >
};

export default Staking;
