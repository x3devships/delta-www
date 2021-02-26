import { VictoryPie, VictoryLabel, VictoryLegend } from 'victory';
import moment from 'moment';
import { useEffect, useState } from 'react';
import { Button } from '@windmill/react-ui';
import { DeltaPanel, DeltaSection, DeltaSectionBlock } from '../Section';
import { DeltaTitleH2, DeltaTitleH3 } from '../Title';
import { useDelta } from '../../hooks';
import { formatting } from '../../helpers';
import { VestingTransactionProgressBar } from '../ProgressBar';
import { DATA_UNAVAILABLE } from '../../config';

const FULLY_VESTING_REFRESH_RATE = 1 * 60 * 1000;

const Vesting = () => {
  const [fullyVestedAtInfo, setFullyVestedAtInfo] = useState(DATA_UNAVAILABLE);
  const [transactionDetailsVisible, setTransactionDetailsVisible] = useState(false);

  const chartWidth = 400;
  const delta = useDelta();

  const getTimeDifferenceFromNow = endTime => {
    const now = moment.now();
    const fullyVestedAt = moment(endTime);
    const diffTime = fullyVestedAt - now;
    const duration = moment.duration(diffTime, 'milliseconds');

    return {
      days: duration.days(),
      hours: duration.hours(),
      minutes: duration.minutes()
    }
  };

  useEffect(() => {
    const update = () => {
      if (delta.data.vestingInProgress) {
        const timeDifference = getTimeDifferenceFromNow(delta.data.fullyVestedAt);
        setFullyVestedAtInfo(timeDifference);
      } else {
        setFullyVestedAtInfo(DATA_UNAVAILABLE);
      }
    };

    if (delta.data.fullyVestedAt !== DATA_UNAVAILABLE) {
      update();
    }

    const interval = setInterval(update, FULLY_VESTING_REFRESH_RATE);
    return () => clearInterval(interval);
  }, [delta.data.fullyVestedAt]);

  const onToggleTransactionDetails = () => {
    setTransactionDetailsVisible(transactionDetailsVisible => !transactionDetailsVisible);
  };

  const renderVestingTransactions = () => {
    const renderTransaction = (tx, index) => {
      if (tx.amount === 0) {
        return <div key={`tx-${index}`} />
      };

      tx.index = index;
      const timeDifference = getTimeDifferenceFromNow(tx.fullVestingTimestamp);

      return <div key={`tx-${index}`} className="text-left pt-4">
        <DeltaPanel>
          <VestingTransactionProgressBar transaction={tx} />
          <div>{formatting.getTokenAmount(tx.amount, 18, 4)} DELTA</div>
          <div>{timeDifference.days} day(s), {timeDifference.hours} hour(s), {timeDifference.minutes} minute(s) remaining</div>
          <div>{tx.percentVested * 100}% completed</div>
          <div>{formatting.getTokenAmount(tx.mature, 18, 4)} mature DELTA</div>
          <div>{formatting.getTokenAmount(tx.immature, 18, 4)} immature DELTA</div>
        </DeltaPanel>
      </div>;
    };

    return <>
      {delta.data.vestingTransactions.map((tx, index) => renderTransaction(tx, index))}
    </>;
  };

  return <DeltaSection requiresConnectedWallet title="Delta Vesting Schedule">
    <div className="bg-whisperEvenMore border border-gray-400 p-4">
      <DeltaTitleH2 center>Total Delta</DeltaTitleH2>
      <div className="w-full text-center">
        <svg viewBox="0 0 600 400">
          <VictoryPie
            standalone={false}
            width={chartWidth} height={400}
            style={{
              labels: { fill: "black" }, data: {
                fillOpacity: 1, stroke: "black", strokeWidth: 1
              }
            }}
            colorScale={["#38a169", "#e53e3e"]}
            categories={{ x: ["mature", "unmature"] }}
            innerRadius={110}
            labelRadius={125}
            labels={({ datum }) => `${datum.y}%`}
            data={[
              { x: "mature", y: 20 },
              { x: "unmature", y: 80 },
            ]}
          />
          <VictoryLabel
            className={fullyVestedAtInfo === DATA_UNAVAILABLE ? 'invisible' : 'visible'}
            textAnchor="middle"
            standalone={false}
            x={chartWidth / 2} y={190}
            lineHeight={[1, 1.5, 1.5, 1.5, 1.5]}
            style={[{ fontSize: 16, fill: 'black' }, { fontSize: 16, fill: 'black' }, { fontSize: 16, fill: 'gray' }, { fontSize: 16, fill: 'gray' }, { fontSize: 16, fill: 'gray' }]}
            text={['Time Until', 'Fully Matured', `${fullyVestedAtInfo.days} days`, `${fullyVestedAtInfo.hours} hours`, `${fullyVestedAtInfo.minutes} minutes`]}
          />
          <VictoryLegend x={380} y={150} standalone={false}
            title=""
            centerTitle
            orientation="horizontal"
            itemsPerRow={1}
            data={[
              { name: "Mature", symbol: { fill: "#38a169" } },
              { name: "Unmature", symbol: { fill: "#e53e3e" } }
            ]}
          />
        </svg>
        <Button onClick={onToggleTransactionDetails}>{!transactionDetailsVisible ? 'See All Transactions ▼' : 'Hide All Transactions ▲'}</Button>
        <DeltaPanel className={`${!transactionDetailsVisible ? 'hidden' : ''}`}>
          {renderVestingTransactions()}
        </DeltaPanel>
      </div>
      <DeltaSectionBlock>
        <DeltaTitleH2>
          <div className="mr-4 text-center">My Wallet</div>

          <DeltaTitleH3 className="flex mt-4 md:mt-2 flex-col md:flex-row">
            <div className="mr-4">Total DELTA:</div>
            <div>{formatting.getTokenAmount(delta.data.total, 0, 4)}</div>
          </DeltaTitleH3>
          <DeltaTitleH3 className="flex mt-4 md:mt-2 flex-col md:flex-row">
            <div className="mr-4">Mature DELTA:</div>
            <div>{formatting.getTokenAmount(delta.data.mature, 0, 4)}</div>
          </DeltaTitleH3>
          <DeltaTitleH3 className="flex mt-4 md:mt-2 flex-col md:flex-row">
            <div className="mr-4">Immature DELTA:</div>
            <div>{formatting.getTokenAmount(delta.data.immature, 0, 4)}</div>
          </DeltaTitleH3>
        </DeltaTitleH2>
      </DeltaSectionBlock>
    </div>
  </DeltaSection>
};

export default Vesting;
