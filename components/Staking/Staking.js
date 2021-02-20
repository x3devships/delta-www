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
import chevron from '../../public/chevron.svg';
import { BonusProgressBar } from '../BonusProgressBar';
import { DATA_UNAVAILABLE } from '../../config';
import { ModalContext } from '../../contexts';

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
        <span className="inline-block font-medium">Your Contribution: </span>
        <span className="inline-block text-green-500">{details.baseContributionAmount.toLocaleString()} ETH</span>
      </div>
      <div className="text-base">
        <span className="inline-block font-medium">Early Signup Bonus ({(details.timeBonus * 100).toFixed(2)}%): </span>
        <span className="inline-block text-green-500">{details.timeBonusAmount.toLocaleString()} ETH</span>
      </div>
      {details.refCode > 0 &&
        <div className="text-base">
          <span className="inline-block font-medium">Referral Signup Bonus ({(details.referralBonus * 100).toFixed(2)})%: </span>
          <span className="inline-block text-green-500">{details.referralBonusAmount.toLocaleString()} ETH</span>
        </div>}
      <hr />
      <div className="text-base">
        <span className="inline-block font-medium">Total contribution Value: </span>
        <span className="inline-block text-green-500">{details.total.toLocaleString()} ETH</span>
      </div>
    </div>
  };

  const getContributionReceiptContent = (details, txId) => {
    return <div>
      <div className="text-base">
        <span className="inline-block font-medium">Your Contribution: </span>
        <span className="inline-block">{details.baseContributionAmount.toLocaleString()} ETH</span>
      </div>
      <div className="text-base">
        <span className="inline-block font-medium">Early Signup Bonus ({(details.timeBonus * 100).toFixed(2)}%): </span>
        <span className="inline-block">+ {details.timeBonusAmount.toLocaleString()} ETH</span>
      </div>
      {details.refCode > 0 &&
        <div className="text-base">
          <span className="inline-block font-medium">Referral Signup Bonus ({(details.referralBonus * 100).toFixed(2)})%: </span>
          <span className="inline-block">+ {details.referralBonusAmount.toLocaleString()} ETH</span>
        </div>}
      <hr />
      <div className="text-base">
        <span className="inline-block font-medium">Total contribution Value: </span>
        <span className="inline-block">{details.total.toLocaleString()} ETH</span>
      </div>
      <div className="text-base">
        <span className="inline-block font-medium">Transaction Id: </span>
        <span><a className="underline" target="_blank" rel="noopener noreferrer" href={`https://etherscan.io/tx/${txId}`}>{txId}</a></span>
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
      ethers.constants.AddressZero,
      lswStats.data.refCode // will be 0 if not defined
    );

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

      await modalContext.showMessage('Congratulations!', <>
        <div className="text-base mt-2">
          You have successfully contributed your Ethereum. You will receive your rLP after the Limited Staking Window has closed.
        </div>
        <hr />
        <div className="mt-5">
          {getContributionReceiptContent(contributionDetails, receipt.transactionHash)}
        </div>
      </>)
    } catch (error) {
      return modalContext.showError('Error contributing', 'An error occured while contributing');
    }

    return Promise.resolve();
  };

  return (
    <section className="w-12/12 flex flex-col-reverse sm:flex-row min-h-0 min-w-0 overflow-hidden">
      <main className="sm:h-full flex-1 flex flex-col min-h-0 min-w-0">
        <section className="flex-1 pt-3 md:p-6 lg:mb-0 lg:min-h-0 lg:min-w-0">
          <div className="flex flex-col lg:flex-row w-full">
            <div className="w-full lg:flex-1 px-3 min-h-0 min-w-0">
              <div className="w-full min-h-0 min-w-0 xs:pb-50">
                <div className="m-auto h-80 border-black border-2 border-b xs:h-96">
                  <div className="flex">
                    <div className="m-auto w-10/12 text-4xl py-9 font-wulkan">{t('limitedStaking')}</div>
                    <img src={chevron} alt="chevron" className="m-auto" />
                  </div>
                  <ProgressBarCountDown lswStats={lswStats} />
                </div>
                <div className="h-4/6 border-2 pt-2 border-black border-t-0">
                  <div className="m-auto w-11/12 text-4xl py-9 font-wulkan">{t('limitedStaking')}</div>
                  <div className="m-auto w-11/12 text-xl py-2 font-wulkan">
                    {t('yourContribution')} {lswStats.data.totalEthContributed}
                  </div>
                  <div className="flex space-x-160 sm:flex-wrap sm:space-x-0">
                    <iframe style={{
                      marginLeft: 'auto',
                      marginRight: 'auto'
                    }} title="contribution" src="https://duneanalytics.com/embeds/20459/42016/MCZSRgV5KrBby66NVZpKK7FxOdTHxg0JEJecWbu9" width="95%" height="391" />
                  </div>
                </div>
                <div className="flex h-128 border-2 pt-2 border-black border-t-0 pl-9 sm:block sm:pb-5 sm:pl-2">
                  <div className="flex-1 m-auto w-11/12 py-9 pl-9 mb-9 sm:pl-0">
                    <div className="text-4xl pb-4 font-wulkan">{t('bonus')}</div>
                    <div className="pb-2" dangerouslySetInnerHTML={{ __html: t('earnWithDelta') }} />
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
                      ) : (
                          <div className="flex w-6/12">
                            <Input
                              value={ethAmountText}
                              style={{
                                border: '0.063rem solid black',
                                marginRight: '0.313rem',
                                marginTop: '0.938rem',
                                minWidth: '45%',
                                backgroundColor: 'transparent'
                              }}
                              onChange={onEthAmountChanged}
                              valid={validEthAmount}
                            />
                            <Button
                              onClick={() => onMaxEthAmount()}
                              style={{
                                marginRight: '1px',
                                borderRadius: '0px',
                                backgroundColor: 'gray',
                                padding: '1rem',
                                marginTop: '1rem'
                              }}
                              type="number"
                              className="p-4 mt-4 inline-block text-white uppercase flex ml-2"
                            >
                              <span className="uppercase">{t('max')}</span>
                            </Button>
                            <TransactionButton
                              text="Contribute"
                              textLoading="Contributing..."
                              secondaryLooks
                              disabled={lswStats.timeStart === DATA_UNAVAILABLE}
                              onClick={onContribute}
                            />
                          </div>
                        )}
                    </div>
                    {!validEthAmount && <HelperText valid={false}>{t('validContribution')}</HelperText>}
                  </div>
                  <div className="flex-1 pr-9 pt-9">
                    <BonusProgressBar />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </section>
  );
};

export default Staking;
