import { VictoryPie, VictoryLabel, VictoryLegend } from 'victory';
import moment from 'moment';
import { useEffect, useState } from 'react';
import { Button } from '@windmill/react-ui';
import { DeltaPanel, DeltaSection, DeltaSectionBlock } from '../Section';
import { DeltaTitleH2, DeltaTitleH3, DeltaTitleH4 } from '../Title';
import { useDelta } from '../../hooks';
import { formatting } from '../../helpers';
import { VestingTransactionProgressBar } from '../ProgressBar';

const Vesting = () => {
  const [currentTime, setCurrentTime] = useState(1);
  const [transactionDetailsVisible, setTransactionDetailsVisible] = useState(false);

  const chartWidth = 400;
  const delta = useDelta();

  useEffect(() => {
    const interval = setInterval(() => setCurrentTime(t => t + 1), 1000);
    return () => clearInterval(interval);
  });

  const onToggleTransactionDetails = () => {
    setTransactionDetailsVisible(transactionDetailsVisible => !transactionDetailsVisible);
  };

  const renderVestingTransactions = () => {
    const renderTransaction = (tx, index) => {
      if (tx.amount === 0) {
        return <></>
      };

      tx.index = index;

      return <div key={`tx-${index}`} className="text-left pt-4">
        <DeltaPanel>
          <VestingTransactionProgressBar transaction={tx} />
          <div>{formatting.getTokenAmount(tx.amount, 18, 4)}</div>
          <div>{tx.fullVestingTimestamp}</div>
          <div>{tx.percentVested}</div>
          <div>{formatting.getTokenAmount(tx.immature, 18, 4)}</div>
          <div>{formatting.getTokenAmount(tx.mature, 18, 4)}</div>
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
            textAnchor="middle"
            standalone={false}
            x={chartWidth / 2} y={190}
            lineHeight={[1.5, 1, 2]}
            style={[{ fontSize: 16, fill: 'black' }, { fontSize: 16, fill: 'black' }, { fontSize: 16, fill: 'gray' }]}
            text={['Time until fully', 'matured', currentTime]}
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
