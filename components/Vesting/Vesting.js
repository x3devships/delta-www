import { VictoryPie, VictoryLabel, VictoryLegend } from 'victory';
import { useContext, useEffect, useState } from 'react';
import { Button } from '@windmill/react-ui';
import { DeltaPanel, DeltaSection, DeltaSectionBox } from '../Section';
import { DeltaTitleH3 } from '../Title';
import { formatting, transactions, vesting } from '../../helpers';
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

  useEffect(() => {
    const update = () => {
      if (globalHooks.delta.data.vestingInProgress) {
        const timeDifference = vesting.getVestingTimeLeft(globalHooks.delta.data.fullyVestedAt);
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
    const [currentOpened, setCurrentOpened] = useState(0);

    const renderTransaction = (tx, index, opened) => {
      tx.index = index;
      const vestingTimeLeft = vesting.getVestingTimeLeft(tx.fullVestingTimestamp);

      return <div key={`tx-${index}`} className="text-left mt-4">
        <DeltaSectionBox opened={opened} onOpen={(i) => setCurrentOpened(i)} index={index} title={`Transaction ${index}`}>
          <div className="mb-2">
            <div>Time until fully matured:</div>
            <div>{vestingTimeLeft.days} Day(s) {vestingTimeLeft.hours} Hour(s) {vestingTimeLeft.minutes} Minute(s)</div>
          </div>
          <VestingTransactionProgressBar transaction={tx} />
          <div className="ml-1 mt-1">{formatting.getTokenAmount(tx.mature, 18, 4)} / {formatting.getTokenAmount(tx.immature, 18, 4)} mature</div>
        </DeltaSectionBox>
      </div>;
    };

    return <>
      {globalHooks.delta.data.vestingTransactions
        .filter(tx => tx.amount !== 0)
        .map((tx, index) => renderTransaction(tx, index, index === currentOpened))}
    </>;
  };

  const renderMyWallet = () => {
    const onStakeDialog = async () => {

      const onStake = async (amount, amountBN, valid) => {
        if (!valid) {
          await modalContext.showError('Error', 'Invalid input');
        } else {
          const confirmed = await modalContext.showConfirm('Staking', `Are you sure you wanna stake ${amount} delta?`);

          if (confirmed) {
            // TODO: add web3 call, be sure to use amountBN
            // TODO: Update delta balance using delta hook update function
          }
        }
      };

      const content = <DeltaPanel>
        <TokenInput
          className="mt-4"
          token="delta"
          buttonText="Stake"
          transactionButtonUnder
          transactionButtonNoBorders
          buttonTextLoading="Staking..."
          onOk={onStake} />
      </DeltaPanel >;

      await modalContext.showMessage('Staking', content, false);
    };

    return <div >
      <ul className="list-disc list-inside py-4">
        <li>Total DELTA: {formatting.getTokenAmount(globalHooks.delta.data.total, 0, 4)} DELTA</li>
        <li>Mature DELTA: {formatting.getTokenAmount(globalHooks.delta.data.mature, 0, 4)} DELTA</li>
        <li>Immature DELTA: {formatting.getTokenAmount(globalHooks.delta.data.immature, 0, 4)} DELTA</li>
      </ul>
      <DeltaPanel className="flex items-center text-center flex-wrap">
        <DeltaButton className="flex-1 mr-4 md:flex-grow-0" labelBottom="Earn Yield" onClick={() => onStakeDialog()}>Stake in vault</DeltaButton>
        <DeltaButton className="flex-1 md:flex-grow-0" labelBottom="Earn Yield" onClick={() => { }}>Trade Delta</DeltaButton>
      </DeltaPanel>
    </div>
  };

  const renderRLPStats = () => {
    const onStake = async (amount, amountBN, valid) => {
      if (!valid) {
        await modalContext.showError('Error', 'Invalid input');
      } else {
        const confirmed = await modalContext.showConfirm('Staking', `Are you sure you wanna stake ${amount} rLP?`);

        if (confirmed) {
          // TODO: add web3 call
          // TODO: call the staking update method and user rLP balance
        }
      }
    };

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
        <defs>
          <linearGradient id="chartGradient2" x1="0%" x2="0%" y1="0%" y2="100%">
            <stop offset="0%" stopColor="#DB77EB" stopOpacity="1" />
            <stop offset="100%" stopColor="#DBC9D6" stopOpacity="0.5" />
          </linearGradient>
        </defs>
        <VictoryPie
          standalone={false}
          width={chartWidth} height={400}
          style={{ labels: { fill: f => f.datum.x === "mature" ? 'white' : 'black' }, data: { fill: f => f.datum.x === "mature" ? '#4315C7' : "url(#chartGradient2)", fillOpacity: 1, stroke: "black", strokeWidth: 0 } }}
          colorScale={["#4315C7", "#9E9E9E"]}
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
          style={[{ fontSize: 18, fill: 'black' }, { fontSize: 18, fill: 'black' }, { fontSize: 14, fill: 'black' }, { fontSize: 14, fill: 'black' }, { fontSize: 14, fill: 'black' }]}
          text={['Time Until', 'Fully Matured', `${fullyVestedAtInfo.days} days`, `${fullyVestedAtInfo.hours} hours`, `${fullyVestedAtInfo.minutes} minutes`]}
        />
        <VictoryLegend x={115} y={380} standalone={false}
          title=""
          centerTitle
          orientation="horizontal"
          itemsPerRow={2}
          data={[
            { name: "Mature", symbol: { type: 'square', fill: "#4315C7" } },
            { name: "Unmature", symbol: { type: 'square', fill: "#DBC9D6" } }
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
        <DeltaButton hidePlus lassName="flex-1 md:flex-none" onClick={onToggleTransactionDetails}>{!transactionDetailsVisible ? 'See All Transactions ▼' : 'Hide All Transactions ▲'}</DeltaButton>
      </DeltaPanel>
      <DeltaPanel className={`${!transactionDetailsVisible ? 'hidden' : ''}`}>
        {renderVestingTransactions()}
      </DeltaPanel>
    </DeltaPanel>
  </DeltaSection>
};


export default Vesting;
