/* eslint-disable react/no-danger */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */

import { useContext } from 'react';
import { useWallet } from 'use-wallet';
import { VictoryChart, VictoryGroup, VictoryArea } from 'victory';
import { DeltaPanel, DeltaSection } from '../Section';
import { DeltaTitleH3 } from '../Title';
import { errors, formatting } from '../../helpers';
import useReferralRewardsChartData from '../../hooks/useReferralRewardsChartData';
import { DATA_UNAVAILABLE } from '../../config';
import TransactionButton from '../Button/TransactionButton';
import { useYam } from '../../hooks';
import { ModalContext } from '../../contexts';
import { Spinner } from '../Spinner';
import { GlobalHooksContext } from '../../contexts/GlobalHooks';

const ReferralProgram = () => {
  const yam = useYam();
  const wallet = useWallet();
  const globalHooks = useContext(GlobalHooksContext);
  const modalContext = useContext(ModalContext);
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
      globalHooks.lswStats.update();

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

  return <DeltaSection requiresConnectedWallet title="Delta Referral Program">
    <DeltaPanel className="md:mt-0">
      <div className="md:mt-0">
        <div className="md:hidden">
          The Delta Referral Program has ended.<br />
          You can claim your rewards below.
        </div>

        <div className="flex flex-col md:flex-row-reverse">
          <div className="w-full">
            <DeltaTitleH3 className="mt-8 md:mt-0">Your Referral Rewards</DeltaTitleH3>
            {globalHooks.lswStats.data.referralBonusWETH !== DATA_UNAVAILABLE && globalHooks.lswStats.data.referralBonusWETH > 0 ?
              <div className="w-full">
                <svg style={{ height: 0 }}>
                  <defs>
                    <linearGradient id="chartGradient" x1="0%" x2="0%" y1="0%" y2="100%">
                      <stop offset="0%" stopColor="#2F45C5" stopOpacity="1" />
                      <stop offset="100%" stopColor="#2F45C5" stopOpacity="0" />
                    </linearGradient>
                  </defs>
                </svg>
                <VictoryChart padding={34} width={400} height={300} scale={{ x: "time", y: "linear" }} minDomain={{ y: 0 }}>
                  <VictoryGroup
                    style={{
                      data: { strokeWidth: 1, fillOpacity: 0.5 }
                    }}
                  >
                    <VictoryArea
                      style={{
                        data: { fill: "url(#chartGradient)", stroke: "#2F45C5" }
                      }}
                      x={d => new Date(d.date)}
                      y="referralBonusWETH"
                      data={chartData.data}
                    />
                  </VictoryGroup>
                </VictoryChart>
              </div>
              : <></>}
          </div>
          <DeltaPanel className="mt-8 md:mt-0">
            <p className="hidden md:block">
              The Delta Referral Program has ended.<br />
              You can claim your rewards below.
            </p>
            <div className="mt-0 md:mt-8">
              <DeltaTitleH3>Your Referral Bonus</DeltaTitleH3>

              <ul className="list-disc list-inside py-4">
                <li>ETH to be claimed: {formatting.getTokenAmount(globalHooks.lswStats.data.referralBonusWETH, 0, 8)}</li>
              </ul>
              <DeltaPanel>
                <TransactionButton disabled={globalHooks.lswStats.data.referralBonusWETH <= 0} text={globalHooks.lswStats.data.referralBonusWETH > 0 ? 'Claim Bonus' : 'Nothing to claim'} textLoading="Claiming..." onClick={() => onClaim()} />
              </DeltaPanel>
            </div>
          </DeltaPanel>
        </div>
      </div>
    </DeltaPanel>
  </DeltaSection>
};

export default ReferralProgram;
