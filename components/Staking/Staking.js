/* eslint-disable react/no-danger */
import { useContext, useEffect, useState } from 'react';
import { Button, Input, HelperText } from '@windmill/react-ui';
import useTranslation from 'next-translate/useTranslation';
import { useWallet } from 'use-wallet';
import { ethers } from 'ethers';
import { useEthBalance, useLSWStats, useYam } from '../../hooks';
import { ProgressBarCountDown } from '../ProgressBarCountDown';
import { TransactionButton } from '../Button';
import plus from '../../public/plus.svg';
import { BonusProgressBar } from '../BonusProgressBar';
import { DATA_UNAVAILABLE } from '../../config';
import { ModalContext } from '../../contexts';
import { errors } from '../../helpers';
import { DeltaPanel, DeltaSection, DeltaSectionBlock } from '../Section';
import { DeltaTitleH2 } from '../Title';

const Staking = ({ onWalletConnect }) => {
  const { t } = useTranslation('home');
  const yam = useYam();
  const ethBalance = useEthBalance();
  const lswStats = useLSWStats();
  const wallet = useWallet();
  const [connectWalletVisible, setConnectWalletVisible] = useState(true);
  const [ethAmountText, setEthAmountText] = useState('');
  const [ethAmount, setEthAmount] = useState(false);
  const [validEthAmount, setValidEthAmount] = useState(true);

  const modalContext = useContext(ModalContext);

  useEffect(() => {
    console.log('totalEthContributed', lswStats.data.totalEthContributed);
  }, [lswStats]);

  useEffect(() => {
    console.log('eth balance', ethBalance);
  }, [ethBalance]);

  useEffect(() => {
    console.log('ethAmount', ethAmount);
  }, [ethAmount]);

  useEffect(() => {
    if (!wallet.account) {
      setConnectWalletVisible(true);
    } else {
      setConnectWalletVisible(false);
    }
  }, [wallet]);

  const onEthAmountChanged = e => {
    const text = e.target.value.trim();
    setEthAmountText(text);
    setValidEthAmount(true);

    if (text === '') {
      setEthAmount(false);
      return;
    }

    const potentialAmount = parseFloat(e.target.value);
    if (potentialAmount > ethBalance || potentialAmount < 0 || Number.isNaN(potentialAmount) || potentialAmount == 0) {
      setValidEthAmount(false);
    } else if (potentialAmount > 0) {
      setEthAmount(potentialAmount);
    }
  };

  const onMaxEthAmount = () => {
    setEthAmountText(ethBalance);
    setEthAmount(ethBalance);
  };

  const isContributionValid = () => {
    return lswStats.data.timeStart !== DATA_UNAVAILABLE &&
      ethBalance !== DATA_UNAVAILABLE &&
      validEthAmount &&
      ethAmountText.toString().trim() !== '';
  };

  const getContributionWithBonus = (amount, bonusPercent) => {
    bonusPercent = parseFloat(bonusPercent);

    if (Number.isNaN(bonusPercent)) {
      return 0;
    }

    return amount * bonusPercent;
  };

  const getContributionDetails = (value, timeBonus, referralBonus, refCode) => {
    timeBonus = parseFloat(timeBonus) || 0;
    referralBonus = parseFloat(referralBonus) || 0;

    const baseContributionAmount = value / 1e18;
    const timeBonusAmount = getContributionWithBonus(baseContributionAmount, timeBonus);
    const referralBonusAmount = getContributionWithBonus(baseContributionAmount, referralBonus);
    const total = baseContributionAmount + timeBonusAmount + referralBonusAmount;

    return {
      value,
      baseContributionAmount,
      timeBonusAmount,
      timeBonus,
      referralBonusAmount,
      referralBonus,
      refCode,
      total
    };
  };

  const getContributionConfirmationDetailsContent = details => {
    return <div>
      <div className="text-base">
        <span className="block font-medium">Your Contribution:</span>
        <span className="block text-green-500">{details.baseContributionAmount.toLocaleString()} ETH</span>
      </div>
      <div className="text-base">
        <span className="block font-medium">Early Signup Bonus ({(details.timeBonus * 100).toFixed(2)}%):</span>
        <span className="block text-green-500">+ {details.timeBonusAmount.toLocaleString()} ETH</span>
      </div>
      {details.refCode > 0 &&
        <div className="text-base">
          <span className="block font-medium">Referral Signup Bonus ({(details.referralBonus * 100).toFixed(2)}%):</span>
          <span className="block text-green-500">+ {details.referralBonusAmount.toLocaleString()} ETH</span>
        </div>}
      <hr />
    </div>
  };

  const getContributionReceiptContent = (details, txId) => {
    const shortTxId = `${txId.substring(0, 8)}...${txId.substring(txId.length - 7, txId.length - 1)}`;

    return <div>
      <div className="text-base">
        <span className="block font-medium">Your Contribution:</span>
        <span className="block">{details.baseContributionAmount.toLocaleString()} ETH</span>
      </div>
      <div className="text-base">
        <span className="block font-medium">Early Signup Bonus ({(details.timeBonus * 100).toFixed(2)}%):</span>
        <span className="block">{details.timeBonusAmount.toLocaleString()} ETH</span>
      </div>
      {details.refCode > 0 &&
        <div className="text-base">
          <span className="block font-medium">Referral Signup Bonus ({(details.referralBonus * 100).toFixed(2)}%):</span>
          <span className="block">{details.referralBonusAmount.toLocaleString()} ETH</span>
        </div>}
      <hr />
      <div className="text-base">
        <span className="block font-medium">Total contribution Value:</span>
        <span className="block">{details.total.toLocaleString()} ETH</span>
      </div>
      <div className="text-base">
        <span className="block font-medium">Transaction Id:</span>
        <span className="block font-medium"><a className="underline" target="_blank" rel="noopener noreferrer" href={`https://etherscan.io/tx/${txId}`}>{shortTxId}</a></span>
      </div>
    </div>
  };

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

    const contributionDetails = getContributionDetails(value, lswStats.data.currentTimeBonus, lswStats.data.currentReferralBonus, lswStats.data.refCode);
    const contributionDetailsContent = getContributionConfirmationDetailsContent(contributionDetails);

    const contributionConfirmed = await modalContext.showConfirm('Transaction Confirmation', contributionDetailsContent);

    if (!contributionConfirmed) {
      return Promise.reject();
    }

    const transactionMessage = modalContext.showControlledMessage('Transaction in progress...',
      <button type="button" className="bg-rose-600" disabled>
        <svg className="animate-spin h-5 w-5 mr-3" viewBox="0 0 24 24" />
        {/* TODO: style with animation doesn't work ... Transaction in progress... */}
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

  const renderContributeForm = () => {
    return <div className="mt-4">
      <div className="flex md:grid md:gap-2 md:grid-cols-2">
        <div className="bg-white flex border border-black">
          <div className="p-3">
            <Input
              type="number"
              value={ethAmountText}
              placeholder='0.00'
              onChange={onEthAmountChanged}
              valid={validEthAmount}
              className="border-transparent text-xl"
              style={{ borderBottom: '1px solid black' }}
            />
          </div>
          <div className="pr-3 text-sm self-end mb-3">ETH</div>
        </div>
        <div className="p-1 max-w-max border border-black ml-1 md:ml-0">
          <Button onClick={() => onMaxEthAmount()} className="bg-gray-400 h-full ring-pink-300 ring-inset focus:bg-gray-400">
            <span className="uppercase">{t('max')}</span>
          </Button>
        </div>
      </div>
      {!validEthAmount && <HelperText valid={false}>{t('validContribution')}</HelperText>}
      <div className="text-gray-600 font-thin text-sm">Staked ETH cannot be withdrawn</div>

      <TransactionButton
        text="Contribute"
        textLoading="Contributing..."
        secondaryLooks
        disabled={lswStats.timeStart === DATA_UNAVAILABLE}
        onClick={onContribute}
      />
    </div>;
  };

  return <DeltaSection center title={t('limitedStaking')}>
    <DeltaPanel>
      <ProgressBarCountDown lswStats={lswStats} />
    </DeltaPanel>
    <DeltaSectionBlock>
      <div className="block md:grid md:grid-cols-2 ">
        <div className="pt-0 md:pt-4">
          <DeltaTitleH2>{t('lswExplanationTitle')}</DeltaTitleH2>
          <div className="text-justify mt-4 md:mt-2 pr-0 md:pr-8 break-normal">
            <p className="pt-0 md:pt-4">Delta is using a special event called Limited Staking Window to launch its tokens.
            The Limited Staking Window allows participants to stake Ethereum and receive rLP tokens in return.
   at the end of the Limited Staking Window (March 4th, 9:30AM PST). </p>
            <p className="pt-0 md:pt-4"> The window will remain open for 10 days, rewarding early stakers with a bonus of up to 30%.</p>
            <p className="pt-0 md:pt-4"> Once the Limited Staking Window closed, participants can claim rLP tokens and stake them in the Deep Farming Vault to earn yield. </p>
            <p className="pt-0 md:pt-4"> The Delta token will launch on Uniswap and become tradable while the first liquidity rebasing will increase the minting price of rLP by ~150%.</p>



          </div>
        </div>
        <div className="mt-4 md:mt-2 pt-4 pl-2"><iframe title="contribution" src="https://duneanalytics.com/embeds/20459/42016/MCZSRgV5KrBby66NVZpKK7FxOdTHxg0JEJecWbu9" width="100%" height="391" /></div>
      </div>
      <div className="m-auto text-xl mt-4 text-center">
        <div className="font-bold">{t('yourContribution')}</div><div>{lswStats.data.totalEthContributed.toLocaleString()} ETH</div>
      </div>
    </DeltaSectionBlock>
    <DeltaSectionBlock>
      <div className="block md:grid md:grid-cols-2 md:gap-6 ">
        <div className="md:border-0 md:border-gray-400 md:border-r md:pr-2">
          <DeltaTitleH2>{t('contribute')}</DeltaTitleH2>
          <div className="pb-2 mt-3">{t('earnWithDelta')}</div>
          <div>
            {connectWalletVisible ? (
              <Button
                onClick={() => onWalletConnect()}
                className="p-4 mt-4 inline-block text-white uppercase flex ml-2"
                style={{
                  marginRight: '1px',
                  borderRadius: '0px',
                  backgroundColor: 'black',
                  padding: '1rem',
                  marginTop: '1rem'
                }}
              >
                <span>{t('connectWallet')}</span>
                <img alt="+" src={plus} className="m-auto pl-8" />
              </Button>
            ) : renderContributeForm()}
          </div>
        </div>
        <div className="mt-6 md:mt-0">
          <DeltaTitleH2>Your Bonus</DeltaTitleH2>
          <div className="mt-4 md:mt-2"> <BonusProgressBar /></div>
        </div>
      </div>
    </DeltaSectionBlock>
  </DeltaSection>
};

export default Staking;
