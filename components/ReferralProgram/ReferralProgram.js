/* eslint-disable react/no-danger */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */

import { useContext, useEffect, useState } from 'react';
import useTranslation from 'next-translate/useTranslation';
import { useWallet } from 'use-wallet';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import moment from 'moment';
import { DeltaPanel, DeltaSection } from '../Section';
import { DeltaTitleH3 } from '../Title';
import { formatting } from '../../helpers';
import { ConnectWalletButton } from '../Buttons';
import useReferralRewardsChartData from '../../hooks/useReferralRewardsChartData';

const ReferralProgram = ({ lswStats }) => {
  const wallet = useWallet();
  const { t } = useTranslation('home');
  const chartData = useReferralRewardsChartData();

  const formatXAxis = (tickItem) => {
    return moment(tickItem).format('MMM Do YY');
  };

  return <DeltaSection title={t('deltaReferral')}>
    <DeltaPanel>
      <div className="block md:grid md:grid-cols-2 md:gap-6">
        <div className="md:mt-0">
          {!wallet?.account ? <ConnectWalletButton /> :
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
