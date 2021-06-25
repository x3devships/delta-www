import { VictoryPie, VictoryLabel, VictoryLegend } from 'victory';
import { useContext, useEffect, useState } from 'react';
// import { Button } from '@windmill/react-ui';
import { useRouter } from 'next/router'
import { DeltaPanel, DeltaSection, DeltaSectionBox } from '../Section';
import { DeltaTitleH3 } from '../Title';
import { formatting, time } from '../../helpers';
import { VestingTransactionProgressBar } from '../ProgressBar';
import { DATA_UNAVAILABLE, deltaSushiswapUrl } from '../../config';
import { GlobalHooksContext } from '../../contexts/GlobalHooks';
import DeltaButton from '../Button/DeltaButton';
// import { TokenInput } from '../Input';
// import TransactionButton from '../Button/TransactionButton';
// import { ModalContext } from '../../contexts';
import { Spinner } from '../Spinner';

const FULLY_VESTING_REFRESH_RATE = 1 * 60 * 1000;

const VestingTransaction = ({ blockTimestamp, tx, index, opened, setCurrentOpened }) => {
  tx.index = index;
  const vestingTimeLeft = time.getTimeLeft(blockTimestamp, tx.fullVestingTimestamp);

  return <div key={`tx-${index}`} className="text-left mt-4">
    <DeltaSectionBox opened={opened} onOpen={(i) => setCurrentOpened(i)} index={index} title={`Transaction ${index + 1}`}>
      <div className="mb-2">
        <div>Time until fully matured:</div>
        <div>{vestingTimeLeft.days} Day(s) {vestingTimeLeft.hours} Hour(s) {vestingTimeLeft.minutes} Minute(s)</div>
      </div>
      <VestingTransactionProgressBar transaction={tx} />
      <div className="ml-1 mt-1">{formatting.getTokenAmount(tx.mature, 18, 4)} / {formatting.getTokenAmount(tx.amount, 18, 4)} mature</div>
    </DeltaSectionBox>
  </div>;
};

const VestingTransactions = () => {
  const [currentOpened, setCurrentOpened] = useState(0);
  const globalHooks = useContext(GlobalHooksContext);

  return <>
    {globalHooks.delta.data.vestingTransactions
      .filter(tx => tx.amount !== 0)
      .map((tx, index) => <VestingTransaction
        key={`vesting-transaction-${index}`}
        blockTimestamp={globalHooks.blockInfo.block.timestamp}
        tx={tx}
        index={index}
        opened={index === currentOpened}
        setCurrentOpened={setCurrentOpened} />)}
  </>;
};

const MyWallet = () => {
  const [fullyVestedAtInfo, setFullyVestedAtInfo] = useState(DATA_UNAVAILABLE);
  const [transactionDetailsVisible, setTransactionDetailsVisible] = useState(false);
  // const modalContext = useContext(ModalContext);
 
  const chartWidth = 400;
  const globalHooks = useContext(GlobalHooksContext);
  const router = useRouter()

  const goToVaultPage = e => {
    e.preventDefault();
    router.push('/vault');
  };

  useEffect(() => {
    const update = async () => {
      if (globalHooks.delta.data.vestingInProgress) {
        const timeLeft = time.getTimeLeft(globalHooks.blockInfo.block.timestamp, globalHooks.delta.data.fullyVestedAt);
        setFullyVestedAtInfo(timeLeft);
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

  const renderMyWallet = () => {
    const globalHooks = useContext(GlobalHooksContext);
    return <div >
      <ul className="list-disc list-inside py-4">
        <li>Total DELTA: {formatting.getTokenAmount(globalHooks.delta.data.total, 0, 4)} DELTA</li>
        <li>Mature DELTA: {formatting.getTokenAmount(globalHooks.delta.data.mature, 0, 4)} DELTA</li>
        <li>Immature DELTA: {formatting.getTokenAmount(globalHooks.delta.data.immature, 0, 4)} DELTA</li>
      </ul>

      <ul className="list-disc list-inside mt-2">
        <li>Total rLP: {formatting.getTokenAmount(globalHooks.rlpInfo.balance + (globalHooks.staking.info.rlp.toString() / 1e18), 0, 4)} rLP</li>
        <li>Unstaked rLP: {formatting.getTokenAmount(globalHooks.rlpInfo.balance, 0, 4)} rLP</li>
        <li>Staked rLP: {formatting.getTokenAmount(globalHooks.staking.info.rlp, 18, 4)} rLP</li>
      </ul>
    </div>
  };

  const renderChart = () => {
    if (globalHooks.delta.data.percentVested === DATA_UNAVAILABLE) {
      return <div className="mt-4 w-full text-center"><Spinner /></div>
    }

    if (globalHooks.delta.data.total <= 0) {
      return <div className="mt-4 w-full">
        <div>You have no DELTA. They can be obtained on SushiSwap Exchange.</div>
        <a target="_blank" href={deltaSushiswapUrl} rel="noopener noreferrer">
          <DeltaButton className="mt-8">Buy DELTA</DeltaButton>
        </a>
      </div>
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
          categories={{ x: ["mature", "immature"] }}
          innerRadius={115}
          labelRadius={123}
          labels={({ datum }) => `${(datum.y * 100).toFixed(0)}%`}
          data={[
            { x: "mature", y: globalHooks.delta.data.percentVested },
            { x: "immature", y: 1.0 - globalHooks.delta.data.percentVested },
          ]}
        />
        <VictoryLabel
          className={fullyVestedAtInfo === DATA_UNAVAILABLE ? 'invisible' : 'visible'}
          textAnchor="middle"
          standalone={false}
          x={chartWidth / 2} y={200}
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
            { name: "Immature", symbol: { type: 'square', fill: "#DBC9D6" } }
          ]}
        />
      </svg>
    </div>
  };

  return <DeltaSection requiresConnectedWallet title="DELTA Vesting Schedule">
    <DeltaPanel className="md:mt-0">
      <div className="md:mt-0">
        <div className="flex flex-col-reverse md:flex-row-reverse">
          <DeltaPanel className="w-full mt-4">
            <DeltaTitleH3>Total DELTA</DeltaTitleH3>
            {renderChart()}
          </DeltaPanel>
          <DeltaPanel className="mt-4">
            <DeltaTitleH3>My Wallet</DeltaTitleH3>
            {renderMyWallet()}
            <DeltaPanel className="flex items-center text-center flex-wrap mt-4">
              <DeltaButton className="flex-1 mr-4 md:flex-grow-0" labelBottom="Earn Yield" onClick={goToVaultPage}>Stake in vault</DeltaButton>
              <a target="_blank" href={deltaSushiswapUrl} rel="noopener noreferrer">
                <DeltaButton className="flex-1 md:flex-grow-0" labelBottom="Earn Yield" >Trade DELTA</DeltaButton>
              </a>
            </DeltaPanel>
          </DeltaPanel>
        </div>
      </div>
      {globalHooks.delta.data.vestingTransactions !== DATA_UNAVAILABLE && globalHooks.delta.data.vestingTransactions.length > 0 &&
        <DeltaPanel className="block md:flex items-center text-center flex-wrap mt-4">
          <DeltaButton renderIcon={() => transactionDetailsVisible ? <span className="pl-2">▲</span> : <span className="pl-2">▼</span>} onClick={onToggleTransactionDetails}>{!transactionDetailsVisible ? 'Show DELTA Vesting Schedules' : 'Hide DELTA Vesting Schedules'}</DeltaButton>
        </DeltaPanel>}
      <DeltaPanel className={`${!transactionDetailsVisible ? 'hidden' : ''}`}>
        <VestingTransactions />
      </DeltaPanel>
    </DeltaPanel>
  </DeltaSection>
};


export default MyWallet;
