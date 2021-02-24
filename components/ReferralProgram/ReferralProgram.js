/* eslint-disable react/no-danger */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */

import { useContext, useEffect, useState } from 'react';
import useTranslation from 'next-translate/useTranslation';
import { useWallet } from 'use-wallet';
import useCopy from '@react-hook/copy';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import moment from 'moment';
import { useYam } from '../../hooks';
import useLSWReferralCode from '../../hooks/useLSWReferralCode';
import { DATA_UNAVAILABLE } from '../../config';
import { TransactionButton } from '../Button';
import { DeltaPanel, DeltaSection } from '../Section';
import { DeltaTitleH3 } from '../Title';
import { errors } from '../../helpers';
import { ModalContext } from '../../contexts';
import { ConnectWalletButton } from '../Buttons';
import useReferralRewardsChartData from '../../hooks/useReferralRewardsChartData';

const ReferralProgram = ({ lswStats, onWalletConnect }) => {
  const yam = useYam();
  const wallet = useWallet();
  const lswRefCode = useLSWReferralCode();
  const [generating, setGenerating] = useState(false);
  const { t } = useTranslation('home');
  const [connectWalletVisible, setConnectWalletVisible] = useState(true);
  const modalContext = useContext(ModalContext);
  const chartData = useReferralRewardsChartData();

  useEffect(() => {
    if (!wallet.account) {
      setConnectWalletVisible(true);
    } else {
      setConnectWalletVisible(false);
    }
  }, [wallet]);

  const onGenerateCode = async () => {
    if (yam && wallet.account) {
      const transaction = yam.contracts.LSW.methods.makeRefCode();

      try {
        setGenerating(true);
        const transactionGasEstimate = await transaction.estimateGas({ from: wallet.account });

        await transaction.send({
          from: wallet.account,
          gas: transactionGasEstimate
        });

        setGenerating(false);
      } catch (error) {
        const transactionError = errors.getTransactionError(error);
        modalContext.showError('Error while approving', transactionError.message);
        console.log(error);
        setGenerating(false);
      }
    }
  };

  const { copied, copy, reset } = useCopy(`https://delta.financial/join/${lswRefCode.referralId}`);

  useEffect(() => {
    setTimeout(reset, 1500);
  }, [copied]);

  function getCopyForButton() {
    if (generating) {
      return 'GENERATING LINK...';
    }
    if (!wallet.account) {
      return 'CONNECT WALLET TO GENERATE REFERRAL LINK';
    }
    return 'GENERATE REFERRAL LINK';
  }

  const renderGenerateLinkButton = () => {
    if (lswRefCode.referralId !== DATA_UNAVAILABLE) {
      return (
        <div className="w-full md:w-6/12 bg-black shadow-xl p-4 mt-6 inline-block text-white font-mono sm:mr-2.5">
          <div dangerouslySetInnerHTML={{ __html: t('referral') }} />
          <div onClick={copy} className="bg-backgroundPage shadow-xl p-4 mt-4 inline-block text-black flex font-mono">
            <span>{copied ? `Copied !` : `delta.financial/join/${lswRefCode.referralId}`}</span>
          </div>
        </div>
      );
    }
    return <TransactionButton text={getCopyForButton()} secondaryLooks onClick={() => (wallet.account ? onGenerateCode() : onWalletConnect())} />;
  };

  const formatXAxis = (tickItem) => {
    return moment(tickItem).format('MMM Do YY');
  };

  return <DeltaSection title={t('deltaReferral')}>
    <DeltaPanel>
      <div className="block md:grid md:grid-cols-2 md:gap-6 ">
        <div className="md:border-0 md:border-gray-400 md:border-r md:pr-2">
          <div className="w-full md:w-6/12">{t('referral')}</div>
          <div className="mt-6 md:mt-0">
            {renderGenerateLinkButton()}
          </div>
        </div>
        <div className="mt-6 md:mt-0">
          {connectWalletVisible ? <ConnectWalletButton onWalletConnect={onWalletConnect} /> :
            <>
              <DeltaTitleH3>Your Referral Bonus</DeltaTitleH3>

              <ResponsiveContainer className="mt-6" aspect={1} height="75%">
                <AreaChart
                  data={chartData.data}
                  margin={{
                    top: 0,
                    right: 0,
                    left: 0,
                    bottom: 0,
                  }}
                >
                  <XAxis interval={24} dataKey="date" tickFormatter={formatXAxis} />
                  <YAxis dataKey="referralBonusWETH" name="ETH" />
                  <Tooltip label="ETH" labelFormatter={() => 'ETH'} />
                  <Area scale="time" dataKey="referralBonusWETH" stroke="#8884d8" fill="#8884d8" />
                </AreaChart >
              </ResponsiveContainer>

              <DeltaPanel>
                <ul className="list-disc">
                                    <li>ETH earned: {lswStats.data.referralBonusWETH}</li>

                  <li>Credit earned: {lswStats.data.referralBonusWETH}</li>
                </ul>
              </DeltaPanel>
            </>}
        </div>
      </div>
    </DeltaPanel>
  </DeltaSection>
};

export default ReferralProgram;
