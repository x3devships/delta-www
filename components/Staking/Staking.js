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
      <div className="flex flex-col md:flex-row">
        <div className="mr-4">You Contributed:</div>
        <div className="block">{formatting.getTokenAmount(globalHooks.lswStats.data.accountContributedEth, 0, 6)} ETH</div>
      </div>
      <div className="flex mt-4 md:mt-2 flex-col md:flex-row">
        <div className="mr-4">rLP to be claimed:</div>
        <div>{formatting.getTokenAmount(globalHooks.lswStats.data.claimableRlp, 0, 6)} rLP</div>
      </div>
      <DeltaPanel className="flex items-center text-center flex-wrap">
        <TransactionButton text="Claim &amp; Stake" textLoading="Staking..." onClick={() => onClaim(true)} />
        <TransactionButton className="ml-4" text="Claim" textLoading="Claiming..." onClick={() => onClaim(false)} />
      </DeltaPanel>
    </DeltaSectionBlock>
  </DeltaSection >
};

export default Staking;
