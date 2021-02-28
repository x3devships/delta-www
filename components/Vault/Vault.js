import { VictoryPie, VictoryLabel, VictoryLegend } from 'victory';
import moment from 'moment';
import { useContext, useEffect, useState } from 'react';
import { Button } from '@windmill/react-ui';
import { DeltaPanel, DeltaSection, DeltaSectionBlock, DeltaSectionBox } from '../Section';
import { DeltaTitleH2, DeltaTitleH3 } from '../Title';
import { formatting } from '../../helpers';
import { ProgressBarDiamonds, VestingTransactionProgressBar } from '../ProgressBar';
import { DATA_UNAVAILABLE } from '../../config';
import { GlobalHooksContext } from '../../contexts/GlobalHooks';
import DeltaButton from '../Button/DeltaButton';
import { TokenInput } from '../Input';
import TransactionButton from '../Button/TransactionButton';
import { ModalContext } from '../../contexts';

const FULLY_VESTING_REFRESH_RATE = 1 * 60 * 1000;

const VaultInfoBox = ({ className }) => {
  return <div className={`bg-purpleGray flex flex-row border border-black ${className}`}>
    <div className="flex border-r border-black flex-col text-center">
      <div className="text-xs px-2 pt-1 pb-2">
        TVL
      </div>
      <div className="text-2xl self-center px-4">
        rLP
      </div>
    </div>
    <div className="flex border-r border-black flex-col text-center flex-grow">
      <div className="text-xs px-2 pt-1 pb-2">
        Amount Staked
      </div>
      <div className="text-2xl self-center px-4 self-end flex flex-grow">
        12,001
      </div>
    </div>
    <div className="flex flex-col text-center">
      <div className="text-xs px-2 pt-1 pb-2">
        Yearly ROI
      </div>
      <div className="text-2xl self-center px-4">
        500%
      </div>
    </div>
  </div >
};

const Vault = () => {
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

      return <div key={`tx-${index}`} className="text-left mt-4">
        <DeltaSectionBox title={`Transaction ${index}`}>
          <div className="mb-2">
            <div>Time until fully matured:</div>
            <div>{timeDifference.days} Day(s), {timeDifference.hours} Hour(s), {timeDifference.minutes} Minute(s)</div>
          </div>
          <VestingTransactionProgressBar transaction={tx} />
          <div className="ml-1">{formatting.getTokenAmount(tx.mature, 18, 4)} / {formatting.getTokenAmount(tx.immature, 18, 4)}  mature</div>
        </DeltaSectionBox>
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


  return <DeltaSection requiresConnectedWallet title="Delta Farming Vault">
    <DeltaPanel className="md:mt-0">
      <div className="md:mt-0">
        <div className="flex flex-col md:flex-row-reverse">
          <DeltaPanel className="w-full mt-4 mb-4 text-2xl text-semibold text-center w-full pr-0 md:pr-12">
            <div className="border border-black py-2 bg-gray-200 mb-1">Up to 750 % APY*</div>
            <div className="border border-black py-2 bg-gray-200">TVL: $145,223,123</div>
          </DeltaPanel>
          <DeltaPanel className="mt-4 pr-12">
            The Deep Farming Vault distributes<br />
            yield to staked rLP and Delta.
          </DeltaPanel>
        </div>
        <div className="mt-4 md:mt-2">
          <DeltaTitleH2 lineunder>rLP Token</DeltaTitleH2>
          <DeltaPanel className="mt-4 flex flex-col md:flex-row">
            <div className="flex w-full flex-grow">
              <VaultInfoBox className="flex flex-grow mr-0 md:mr-24" />
            </div>
            <div className="flex w-full flex-grow">
              <ProgressBarDiamonds className="flex flex-grow" />
            </div>
          </DeltaPanel>
        </div>
      </div>
    </DeltaPanel>
  </DeltaSection>;

  /* return <DeltaSection requiresConnectedWallet title="Delta Farming Vault">
      <DeltaPanel className="md:mt-0">
        <div className="md:mt-0">
          <div className="flex flex-col-reverse md:flex-row-reverse">
            <DeltaPanel className="w-full mt-4">
              <div className="border border-black p-4 bg-gray-200 text-lg text-center mb-1">Up to 750 % APY*</div>
              <div className="border border-black p-4 bg-gray-200 text-lg text-center">TVL: $145,223,123</div>
            </DeltaPanel>
            <DeltaPanel className="mt-4">
              <div>
                The Deep Farming Vault distributes<br />
              yield to staked rLP and Delta.
            </div>
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
    </DeltaSection> */
};


export default Vault;
