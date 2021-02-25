/* eslint-disable react/no-danger */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */

import { useContext, useEffect, useState } from 'react';
import useTranslation from 'next-translate/useTranslation';
import { useWallet } from 'use-wallet';
import { VictoryChart, VictoryGroup, VictoryArea } from 'victory';
import { DeltaPanel, DeltaSection } from '../Section';
import { DeltaTitleH3 } from '../Title';
import { formatting } from '../../helpers';
import { ConnectWalletButton } from '../Buttons';
import useReferralRewardsChartData from '../../hooks/useReferralRewardsChartData';
import { DATA_UNAVAILABLE } from '../../config';

const ReferralProgram = ({ lswStats }) => {
  const wallet = useWallet();
  const { t } = useTranslation('home');
  const chartData = useReferralRewardsChartData();

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
                <ul className="list-disc list-inside">
                  <li>ETH earned: {formatting.getTokenAmount(lswStats.data.referralBonusWETH, 0, 8)}</li>
                  <li>Credit earned: {formatting.getTokenAmount(lswStats.data.referralBonusWETH, 0, 8)}</li>
                </ul>
              </DeltaPanel>
            </>}
        </div>
      </div>
    </DeltaPanel>
  </DeltaSection>
};

export default ReferralProgram;
