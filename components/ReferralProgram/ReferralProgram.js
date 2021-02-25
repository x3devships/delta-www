/* eslint-disable react/no-danger */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */

import { useContext, useEffect, useState } from 'react';
import useTranslation from 'next-translate/useTranslation';
import { useWallet } from 'use-wallet';
import { VictoryChart, VictoryGroup, VictoryArea } from 'victory';
import { DeltaPanel, DeltaSection } from '../Section';
import { DeltaTitleH3, DeltaTitleH4 } from '../Title';
import { errors, formatting } from '../../helpers';
import { ConnectWalletButton } from '../Buttons';
import useReferralRewardsChartData from '../../hooks/useReferralRewardsChartData';
import { DATA_UNAVAILABLE } from '../../config';
import TransactionButton from '../Button/TransactionButton';
import { useYam } from '../../hooks';
import { ModalContext } from '../../contexts';
import { Spinner } from '../Spinner';

const ReferralProgram = ({ lswStats }) => {
  const yam = useYam();
  const wallet = useWallet();
  const modalContext = useContext(ModalContext);
  const { t } = useTranslation('home');
  const chartData = useReferralRewardsChartData();

  const onClaim = async () => {
    const transaction = await yam.contracts.LSW.methods.getWETHBonusForReferrals();

    try {
      const transactionGasEstimate = await transaction.estimateGas({ from: wallet.account });

      const transactionMessage = modalContext.showControlledMessage('Claiming...', <Spinner label="Transaction in progress..." />);

      await transaction.send({
        from: wallet.account,
        gas: transactionGasEstimate
      });

      transactionMessage.close();

      await modalContext.showMessage('Success', <>
        <div className="text-lg">Your bonus has been claimed and is now available in your wallet</div>
      </>)
    } catch (error) {
      const decodedError = errors.getTransactionError(error, 'An error occured while claiming');
      console.log(decodedError);
      return modalContext.showError('Claiming Error', decodedError.message);
    }

    return Promise.resolve();
  };

  return <DeltaSection title={t('deltaReferral')}>
    <DeltaPanel>
      <div className="block">
        <div className="md:mt-0">
          {!wallet?.account ? <ConnectWalletButton /> :
            <>
              <DeltaTitleH3>Your Referral Bonus</DeltaTitleH3>

              {lswStats.data.referralBonusWETH !== DATA_UNAVAILABLE && lswStats.data.referralBonusWETH > 0 ?
                <div className="w-full md:w-8/12">
                  <VictoryChart padding={34} width={400} height={400} scale={{ x: "time", y: "linear" }} minDomain={{ y: 0 }}>
                    <VictoryGroup
                      style={{
                        data: { strokeWidth: 1, fillOpacity: 0.6 }
                      }}
                    >
                      <VictoryArea
                        style={{
                          data: { fill: "#b794f4", stroke: "#b794f4" }
                        }}
                        x={d => new Date(d.date)}
                        y="referralBonusWETH"
                        data={chartData.data}
                      />
                    </VictoryGroup>
                  </VictoryChart>
                </div>
                : <></>}

              <DeltaPanel>
                <DeltaTitleH4 className="flex mt-4 md:mt-2 flex-col md:flex-row">
                  <div className="mr-4">ETH earned:</div>
                  <div>{formatting.getTokenAmount(lswStats.data.referralBonusWETH, 0, 8)}</div>
                </DeltaTitleH4>
                <DeltaTitleH4 className="flex mt-4 md:mt-2 flex-col md:flex-row">
                  <div className="mr-4">Credit earned:</div>
                  <div>{formatting.getTokenAmount(lswStats.data.referralBonusWETH, 0, 8)}</div>
                </DeltaTitleH4>
                <DeltaPanel>
                  <TransactionButton text="Claim" textLoading="Staking..." onClick={() => onClaim()} />
                </DeltaPanel>
              </DeltaPanel>
            </>}
        </div>
      </div>
    </DeltaPanel>
  </DeltaSection>
};

export default ReferralProgram;
