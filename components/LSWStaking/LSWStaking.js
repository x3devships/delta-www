/* eslint-disable react/no-danger */
import { useWallet } from 'use-wallet';
import { useContext } from 'react';
import { ProgressBarCountDown } from '../ProgressBar';
import { errors, formatting, transactions } from '../../helpers';
import { DeltaPanel, DeltaSection } from '../Section';
import { useYam } from '../../hooks';
import TransactionButton from '../Button/TransactionButton';
import { ModalContext } from '../../contexts';
import { Spinner } from '../Spinner';
import { GlobalHooksContext } from '../../contexts/GlobalHooks';

const LSWStaking = () => {
  const yam = useYam();
  const wallet = useWallet();
  const globalHooks = useContext(GlobalHooksContext);
  const modalContext = useContext(ModalContext);

  const onClaim = async stake => {
    const claimToWallet = !stake;
    const transaction = await yam.contracts.LSW.methods.claimOrStakeAndClaimLP(claimToWallet);
    const transactionTitle = stake ? 'Claiming and staking...' : 'Claiming...';
    const successMessage = stake ?
      'Your rLP tokens have been claimed and staked. You can see them displayed on the vault page' :
      'Your rLP tokens have been claimed and they are now available in your wallet';

    await transactions.executeTransaction(
      modalContext,
      transaction,
      { from: wallet.account },
      successMessage,
      'Success',
      'Claiming Error',
      transactionTitle
    );

    globalHooks.lswStats.update();

    return Promise.resolve();
  };

  return <DeltaSection title="DELTA is live!">
    <DeltaPanel className="mt-2 md:mt-4">
      <ProgressBarCountDown />
      <div className="text-center mt-6 text-2xl">You can now claim your tokens</div>
    </DeltaPanel>
    <DeltaPanel requiresConnectedWallet>
      <ul className="list-disc list-inside pt-6 pb-4 md:pb-6">
        <li>You Contributed: {formatting.getTokenAmount(globalHooks.lswStats.data.accountContributedEth, 0, 6)} ETH</li>
        <li>rLP to be claimed: {formatting.getTokenAmount(globalHooks.lswStats.data.claimableRlp, 0, 6)} rLP</li>
      </ul>
      <DeltaPanel className="flex items-center text-center flex-wrap">
        <TransactionButton className="flex-1 mr-2 md:mr-0 md:flex-grow-0" disabled={globalHooks.lswStats.data.claimableRlp <= 0} text={globalHooks.lswStats.data.claimableRlp > 0 ? 'Claim & Stake' : 'Nothing to claim'} textLoading="Staking..." onClick={() => onClaim(true)} />
        {globalHooks.lswStats.data.claimableRlp > 0 && <TransactionButton className="flex-1 ml-2 md:ml-4 md:flex-grow-0" text="Claim" textLoading="Claiming..." onClick={() => onClaim(false)} />}
      </DeltaPanel>
    </DeltaPanel>
  </DeltaSection>
};

export default LSWStaking;
