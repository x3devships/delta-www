/* eslint-disable react/no-danger */
import { useWallet } from 'use-wallet';
import { useContext } from 'react';
import { ProgressBarCountDown } from '../ProgressBarCountDown';
import { errors, formatting } from '../../helpers';
import { DeltaPanel, DeltaSection, DeltaSectionBlock } from '../Section';
import { DeltaTitleH2, DeltaTitleH3 } from '../Title';
import { useYam } from '../../hooks';
import TransactionButton from '../Button/TransactionButton';
import { ModalContext } from '../../contexts';

const Staking = ({ lswStats }) => {
  const yam = useYam();
  const wallet = useWallet();
  const modalContext = useContext(ModalContext);

  /*
  const onContribute = async () => {
    if (!yam || !wallet.account) {
      return modalContext.showError('Wallet Connect', 'Please connect to your wallet to continue');
    }

    if (!isContributionValid()) {
      return modalContext.showError('Contribution', 'Please specify a valid contribution amount');
    }

    const agreement = await yam.contracts.LSW.methods.liquidityGenerationParticipationAgreement().call();
    const agreed = await modalContext.showConfirm('Agreement', agreement, 'I Agree', 'Cancel');

    if (!agreed) {
      return Promise.reject();
    }

    const value = ethers.utils.parseEther(ethAmount.toString());

    const contributionDetails = getContributionDetails(value, lswStats.data.currentTimeBonus, lswStats.data.currentReferralBonus, lswStats.data.refCode, lswStats.data.refAddress);
    const contributionDetailsContent = getContributionConfirmationDetailsContent(contributionDetails);

    const contributionConfirmed = await modalContext.showConfirm('Transaction Confirmation', contributionDetailsContent);

    if (!contributionConfirmed) {
      return Promise.reject();
    }

    const transactionMessage = modalContext.showControlledMessage('Transaction in progress...',
      <button type="button" className="bg-rose-600" disabled>
        <svg className="animate-spin h-5 w-5 mr-3" viewBox="0 0 24 24" />
      </button>
    );

    const transaction = await yam.contracts.LSW.methods.contributeLiquidity(
      true,
      lswStats.data.refAddress, // will be address 0x0 if not defined
      lswStats.data.refCode // will be 0 if not defined
    );

    console.log(transaction);

    try {
      const transactionGasEstimate = await transaction.estimateGas({
        from: wallet.account,
        value: value.toString()
      });

      const receipt = await transaction.send({
        from: wallet.account,
        value: value.toString(),
        gas: transactionGasEstimate
      });

      transactionMessage.close();

      setEthAmountText('');
      setEthAmount(false);

      await modalContext.showMessage('Congratulations!', <>
        <div className="text-lg">You will be able to claim your rLP tokens after the Limited Staking Window has closed.</div>
        <div className="mt-4">
          {getContributionReceiptContent(contributionDetails, receipt.transactionHash)}
        </div>
      </>)
    } catch (error) {
      const decodedError = errors.getTransactionError(error, 'An error occured while contributing');
      console.log(decodedError);
      return modalContext.showError('Error contributing', decodedError.message);
    }

    return Promise.resolve();
  };
*/

  const onClaim = async stake => {
    const claimToWallet = !stake;
    const transaction = await yam.contracts.LSW.methods.claimOrStakeAndClaimLP(claimToWallet);

    try {
      const transactionGasEstimate = await transaction.estimateGas({ from: wallet.account });
      const transactionTitle = stake ? 'Claiming and staking...' : 'Claiming...';
      const successMessage = stake ?
        'Your rLP tokens have been claimed and staked. You can see them displayed on the main page' :
        'Your rLP tokens have been claimed and there are now available in your wallet';

      const transactionMessage = modalContext.showControlledMessage(transactionTitle, <></>);

      await transaction.send({
        from: wallet.account,
        gas: transactionGasEstimate
      });

      transactionMessage.close();

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
      <DeltaTitleH3 className="text-center mt-6">{Math.round(lswStats.data.totalEthContributed).toFixed(0).toLocaleString()} ETH contributed!</DeltaTitleH3>
    </DeltaPanel>
    <DeltaSectionBlock requiresConnectedWallet>
      <DeltaTitleH2>You Contributed: {formatting.getTokenAmount(lswStats.data.accountContributedEth, 0, 6)} ETH</DeltaTitleH2>
      <DeltaTitleH2>rLP to be claimed: {formatting.getTokenAmount(lswStats.data.claimableRlp, 0, 6)} rLP</DeltaTitleH2>
      <DeltaPanel>
        <div className="flex items-center text-center flex-wrap">
          <div><TransactionButton text="Claim &amp; Stake" textLoading="Staking..." onClick={() => onClaim(true)} /></div>
          <div><TransactionButton text="Claim" textLoading="Claiming..." onClick={() => onClaim(false)} /></div>
        </div>
      </DeltaPanel>
    </DeltaSectionBlock>
  </DeltaSection >
};

export default Staking;
