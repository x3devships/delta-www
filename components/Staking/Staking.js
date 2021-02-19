import { useEffect, useState } from 'react';
import { Button, Input, HelperText } from '@windmill/react-ui';
import useTranslation from 'next-translate/useTranslation';
import { useWallet } from 'use-wallet';
import { ethers } from 'ethers';
import BigNumber from 'bignumber.js';
import { useEthBalance, useLSWStats, useYam } from '../../hooks';
import { ProgressBarCountDown } from '../ProgressBarCountDown';
import { TransactionButton } from '../Button';
import plus from '../../public/plus.svg';
import chevron from '../../public/chevron.svg';
import { BonusProgressBar } from '../BonusProgressBar';
import { DATA_UNAVAILABLE } from '../../config';
import { ConfirmModal, ErrorModal, ReceiptModal } from '../Modal';

const Staking = ({ onWalletConnect }) => {
  const { t } = useTranslation('home');
  const yam = useYam();
  const ethBalance = useEthBalance();
  const lswStats = useLSWStats();
  const wallet = useWallet();
  const [connectWalletVisible, setConnectWalletVisible] = useState(true);
  const [ethAmountText, setEthAmountText] = useState('');
  const [ethAmount, setEthAmount] = useState(false);
  const [notValidNumber, setNotValidNumber] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [openModalError, setOpenModalError] = useState(false);
  const [openReceiptModal, setOpenReceiptModal] = useState(false);
  const [agreementMessage, setAgreementMessage] = useState('');

  useEffect(() => {
    console.log('totalEthContributed', lswStats.data.totalEthContributed);
  }, [lswStats]);

  useEffect(() => {
    console.log('eth balance', ethBalance / 1e18);
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
  const regexp = /^\d+(\.\d{0,2})?$/;

  const onEthAmountChanged = e => {
    setEthAmountText(e.target.value);
    if (regexp.test(setEthAmountText)) {
      setNotValidNumber(false);
      const potentialAmount = parseFloat(e.target.value);
      if (potentialAmount > ethBalance || potentialAmount <= 0 || Number.isNaN(potentialAmount)) {
        setEthAmount(false);
      } else {
        setEthAmount(potentialAmount);
      }
    } else {
      setNotValidNumber(true);
    }
  };

  const onMaxEthAmount = () => {
    const maxAmount = ethBalance / 1e18;
    setEthAmountText(maxAmount);
    setEthAmount(maxAmount);
  };
  const agreementText = async () => {
    const agreement = await yam.contracts.LSW.methods.liquidityGenerationParticipationAgreement().call();
    setAgreementMessage(agreement);
  };
  const onStake = async () => {
    if (yam && wallet.account) {
      const value = ethers.utils.parseEther(ethAmount.toString());
      console.log('amountE18', value.toString());

      const transaction = await yam.contracts.LSW.methods.contributeLiquidity(
        true,
        ethers.constants.AddressZero,
        lswStats.data.refCode // will be 0 if not defined
      );

      try {
        const transactionGasEstimate = await transaction.estimateGas({ from: wallet.account, value: value.toString() });

        await transaction.send({
          from: wallet.account,
          value: value.toString(),
          gas: transactionGasEstimate
        });
      } catch (error) {
        setOpenModalError(true);
      }
    }
  };

  return (
    <section className="w-12/12 flex flex-col-reverse sm:flex-row min-h-0 min-w-0 overflow-hidden">
      <main className="sm:h-full flex-1 flex flex-col min-h-0 min-w-0">
        <section className="flex-1 pt-3 md:p-6 lg:mb-0 lg:min-h-0 lg:min-w-0">
          <div className="flex flex-col lg:flex-row w-full">
            <div className="w-full lg:flex-1 px-3 min-h-0 min-w-0">
              <div className="w-full min-h-0 min-w-0">
                <div className="m-auto h-80 border-black border-2 border-b">
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
                    <iframe src="https://duneanalytics.com/embeds/20459/42016/MCZSRgV5KrBby66NVZpKK7FxOdTHxg0JEJecWbu9" width="100%" height="391" />
                  </div>
                </div>
                <div className="flex h-128 border-2 pt-2 border-black border-t-0 pl-9 sm:block sm:pb-5 sm:pl-2">
                  <div className="flex-1 m-auto w-11/12 py-9 pl-9 mb-9 sm:pl-0">
                    <div className="text-4xl pb-4 font-wulkan">{t('bonus')}</div>
                    <div className="pb-2 font-gt_americare" dangerouslySetInnerHTML={{ __html: t('earnWithDelta') }} />
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
                          <img src={plus} className="m-auto pl-8" />
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
                            valid={notValidNumber}
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
                            <span>MAX</span>
                          </Button>
                          <TransactionButton
                            disabled={lswStats.data.timeStart === DATA_UNAVAILABLE && ethBalance !== DATA_UNAVAILABLE}
                            text="Stake"
                            textLoading="Staking..."
                            secondaryLooks
                            onClick={() => {
                              agreementText();
                              setOpenModal(true);
                            }}
                          />
                        </div>
                      )}
                    </div>
                    {notValidNumber && <HelperText valid={notValidNumber}>{t('validContribution')}</HelperText>}
                  </div>
                  <div className="flex-1 pr-9 pt-9">
                    <BonusProgressBar />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        <ConfirmModal
          title="Confirmation"
          content={agreementMessage}
          onOpen={openModal}
          onClose={() => setOpenModal(false)}
          onOk={() => {
            onStake();
            setOpenModal(false);
            setOpenReceiptModal(true);
          }}
          cancelContent="Cancel"
          okContent="Confirm"
        />
        <ReceiptModal
          title="Receipt"
          content={lswStats}
          contribution={ethAmountText}
          onOpen={openReceiptModal}
          onClose={() => setOpenReceiptModal(false)}
          onOk={() => {
            setOpenReceiptModal(false);
          }}
          cancelContent="Cancel"
          okContent="Confirm"
        />
        <ErrorModal
          title="Error"
          content="An error has risen please try again"
          onOpen={openModalError}
          onClose={() => setOpenModalError(false)}
          onOk={() => {
            setOpenModalError(false);
          }}
          okContent="Okay"
        />
      </main>
    </section>
  );
};

export default Staking;
