import { VictoryPie, VictoryLabel, VictoryLegend } from 'victory';
import moment from 'moment';
import { useContext, useEffect, useState } from 'react';
import { Button } from '@windmill/react-ui';
import { DeltaPanel, DeltaSection, DeltaSectionBlock } from '../Section';
import { DeltaTitleH2, DeltaTitleH3 } from '../Title';
import { formatting } from '../../helpers';
import { VestingTransactionProgressBar } from '../ProgressBar';
import { DATA_UNAVAILABLE } from '../../config';
import { GlobalHooksContext } from '../../contexts/GlobalHooks';
import DeltaButton from '../Button/DeltaButton';
import { TokenInput } from '../Input';
import TransactionButton from '../Button/TransactionButton';
import { ModalContext } from '../../contexts';

const FULLY_VESTING_REFRESH_RATE = 1 * 60 * 1000;

const Vesting = () => {
  const [fullyVestedAtInfo, setFullyVestedAtInfo] = useState(DATA_UNAVAILABLE);
  const [transactionDetailsVisible, setTransactionDetailsVisible] = useState(false);
  const modalContext = useContext(ModalContext);

  const chartWidth = 400;
  const globalHooks = useContext(GlobalHooksContext);

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
      if (globalHooks.delta.data.vestingInProgress) {
        const timeDifference = getTimeDifferenceFromNow(globalHooks.delta.data.fullyVestedAt);
        setFullyVestedAtInfo(timeDifference);
      } else {
        setFullyVestedAtInfo(DATA_UNAVAILABLE);
      }
    };

    if (globalHooks.delta.data.fullyVestedAt !== DATA_UNAVAILABLE) {
      update();
    }

    const interval = setInterval(update, FULLY_VESTING_REFRESH_RATE);
    return () => clearInterval(interval);
  }, [globalHooks.delta.data.fullyVestedAt]);

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
        <DeltaPanel className="text-sm">
          <VestingTransactionProgressBar transaction={tx} />
          <ul className="list-disc list-inside ml-1">
            <li>{timeDifference.days} day(s), {timeDifference.hours} hour(s), {timeDifference.minutes} minute(s) remaining</li>
            <li>{tx.percentVested * 100}% completed</li>
            <li>{formatting.getTokenAmount(tx.mature, 18, 4)} mature DELTA</li>
            <li>{formatting.getTokenAmount(tx.immature, 18, 4)} immature DELTA</li>
          </ul>
        </DeltaPanel>
      </div>;
    };

    return <>
      {globalHooks.delta.data.vestingTransactions.map((tx, index) => renderTransaction(tx, index))}
    </>;
  };

  const onStake = async (amount, amountBN, valid) => {
    if (!valid) {
      await modalContext.showError('Error', 'Invalid input');
    } else {
      await modalContext.showConfirm('Staking', `Are you sure you wanna stake ${amount} ? (${amountBN && amountBN.toString()})`);
    }
  };

  const renderMyWallet = () => {
    return <div >
      <ul className="list-disc list-inside py-4">
        <li>Total DELTA: {formatting.getTokenAmount(globalHooks.delta.data.total, 0, 4)} ETH</li>
        <li>Mature DELTA: {formatting.getTokenAmount(globalHooks.delta.data.mature, 0, 4)} rLP</li>
        <li>Immature DELTA: {formatting.getTokenAmount(globalHooks.delta.data.immature, 0, 4)} rLP</li>
      </ul>
      <DeltaPanel className="flex items-center text-center flex-wrap">
        <TransactionButton className="flex-1 mr-2 md:mr-0 md:flex-grow-0" labelBottom="Earn Yield" text="Stake in vault" textLoading="Staking..." onClick={() => onStake()} />
        <DeltaButton className="flex-1 ml-2 md:ml-4 md:flex-grow-0" labelBottom="Earn Yield" onClick={() => { }}>Trade Delta</DeltaButton>
      </DeltaPanel>
    </div>
  };

  const renderRLPStats = () => {
    return <div>
      <ul className="list-disc list-inside py-4">
        <li>Total rLP: {formatting.getTokenAmount(globalHooks.rlpInfo.balance + globalHooks.staking.rlpStaked, 0, 4)} rLP</li>
        <li>Unstaked rLP: {formatting.getTokenAmount(globalHooks.rlpInfo.balance, 0, 4)} rLP</li>
        <li>Staked rLP: {formatting.getTokenAmount(globalHooks.staking.rlpStaked, 0, 4)} rLP</li>
      </ul>
      <TokenInput className="mt-4" token="delta" buttonText="Stake" buttonTextLoading="Staking..." labelBottom="this token will be staked" onOk={onStake} />
    </div >
  };

  const renderChart = () => {
    if (globalHooks.lswStats.data.referralBonusWETH === DATA_UNAVAILABLE || globalHooks.lswStats.data.referralBonusWETH <= 0) {
      return <></>;
    }

    return <div className="w-full">
      <svg viewBox="0 40 400 370">
        <VictoryPie
          standalone={false}
          width={chartWidth} height={400}
          style={{ labels: { fill: f => f.datum.x === "mature" ? 'white' : 'black' }, data: { fillOpacity: 1, stroke: "black", strokeWidth: 1 } }}
          colorScale={["#000000", "#9E9E9E"]}
          categories={{ x: ["mature", "unmature"] }}
          innerRadius={110}
          labelRadius={125}
          labels={({ datum }) => `${(datum.y * 100).toFixed(0)}%`}
          data={[
            { x: "mature", y: globalHooks.delta.data.percentVested },
            { x: "unmature", y: 1.0 - globalHooks.delta.data.percentVested },
          ]}
        />
        <VictoryLabel
          className={fullyVestedAtInfo === DATA_UNAVAILABLE ? 'invisible' : 'visible'}
          textAnchor="middle"
          standalone={false}
          x={chartWidth / 2} y={190}
          lineHeight={[1, 1.5, 1.5, 1.5, 1.5]}
          style={[{ fontSize: 16, fill: 'black' }, { fontSize: 16, fill: 'black' }, { fontSize: 14, fill: 'gray' }, { fontSize: 14, fill: 'gray' }, { fontSize: 14, fill: 'gray' }]}
          text={['Time Until', 'Fully Matured', `${fullyVestedAtInfo.days} days`, `${fullyVestedAtInfo.hours} hours`, `${fullyVestedAtInfo.minutes} minutes`]}
        />
        <VictoryLegend x={115} y={380} standalone={false}
          title=""
          centerTitle
          orientation="horizontal"
          itemsPerRow={2}
          data={[
            { name: "Mature", symbol: { fill: "black" } },
            { name: "Unmature", symbol: { fill: "#9E9E9E" } }
          ]}
        />
      </svg>
    </div>
  };

  return <DeltaSection requiresConnectedWallet title="Delta Vesting Schedule">
    <DeltaPanel className="md:mt-0">
      <div className="md:mt-0">
        <div className="flex flex-col-reverse md:flex-row-reverse">
          <DeltaPanel className="w-full mt-4">
            <DeltaTitleH3>Total Delta</DeltaTitleH3>
            {renderChart()}
          </DeltaPanel>
          <DeltaPanel className="mt-4">
            <DeltaTitleH3>My Wallet</DeltaTitleH3>
            {renderMyWallet()}
            <DeltaTitleH3 className="mt-6">rLP Stats</DeltaTitleH3>
            {renderRLPStats()}
          </DeltaPanel>
        </div>
      </div>
      <DeltaPanel className="flex items-center text-center flex-wrap mt-4">
        <Button className="flex-1 md:flex-none" onClick={onToggleTransactionDetails}>{!transactionDetailsVisible ? 'See All Transactions ▼' : 'Hide All Transactions ▲'}</Button>
      </DeltaPanel>
      <DeltaPanel className={`${!transactionDetailsVisible ? 'hidden' : ''}`}>
        {renderVestingTransactions()}
      </DeltaPanel>
    </DeltaPanel>
  </DeltaSection>
};


export default Vesting;
