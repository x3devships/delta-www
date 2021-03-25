import { useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/router'
import { DeltaPanel, DeltaSection } from '../Section';
import { DeltaTitleH2 } from '../Title';
import { ProgressBarDiamonds } from '../ProgressBar';
import { ModalContext } from '../../contexts';
import VaultStaking from './VaultStaking';
import DeltaButton from '../Button/DeltaButton';
import { GlobalHooksContext } from '../../contexts/GlobalHooks';
import { formatting, time } from '../../helpers';
import { TokenInput } from '../Input';
import { DATA_UNAVAILABLE } from '../../config';

const VaultInfoBox = ({ token, className = '' }) => {

  const globalHooks = useContext(GlobalHooksContext);

  return <div className={`bg-purpleGray flex flex-row border border-black md:max-h-full md:h-20 ${className}`}>
    <div className="flex border-r border-black flex-col text-center py-1 md:py-0">
      <div className="text-xs px-2 pt-1 pb-2">
        TVL
      </div>
      <div className="text-2xl self-center px-4 mt-0 md:mt-1">
        {token}
      </div>
    </div>
    <div className="flex border-r border-black flex-col text-center flex-grow py-1 md:py-0">
      <div className="text-xs px-2 pt-1 pb-2">
        Amount Staked
      </div>
      <div className="text-2xl self-center px-4 self-end flex flex-grow mt-0 md:mt-1">
        {formatting.getTokenAmount(globalHooks.staking.vaultStats[token]?.amountTotal, 0, 2)}
      </div>
    </div>
    <div className="flex flex-col text-center py-1 md:py-0">
      <div className="text-xs px-2 pt-1 pb-2">
        Yearly ROI
      </div>
      <div className="text-2xl self-center px-4 mt-0 md:mt-1">
        {formatting.getTokenAmount(globalHooks.staking.vaultStats[token]?.apy, 0, 2)}%
      </div>
    </div>
  </div>
};

// TODO: add web3 integration
const RlpStats = () => {
  const globalHooks = useContext(GlobalHooksContext);

  return <div className="mt-4 md:mt-0">
    <ul className="list-disc list-inside py-4 md:py-8">
      <li>Staked rLP: {formatting.getTokenAmount(globalHooks.staking.info.rlp, 18, 4)} rLP</li>
      <li>Claimable ETH: {formatting.getTokenAmount(globalHooks.staking.info.farmedETH, 18, 4)} ETH</li>
      <li>Claimable DELTA: {formatting.getTokenAmount(globalHooks.staking.info.farmedDelta, 18, 4)} DELTA</li>
    </ul>
  </div >
};

// TODO: add web3 integration
const DeltaStats = () => {
  const globalHooks = useContext(GlobalHooksContext);

  return <div className="mt-4 md:mt-0">
    <ul className="list-disc list-inside py-4 md:py-8">
      <li>Staked DELTA: {formatting.getTokenAmount(globalHooks.staking.info.totalDelta, 18, 4)} rLP</li>
      <li>Claimable ETH: {formatting.getTokenAmount(globalHooks.staking.info.farmedETH, 18, 4)} ETH</li>
      <li>Claimable DELTA: {formatting.getTokenAmount(globalHooks.staking.info.farmedDelta, 18, 4)} DELTA</li>
    </ul>
  </div >
};

/**
 * Only for the delta token
 */
const TopUpDialogContent = () => {
  const [fromStakingRewards, setFromStakingRewards] = useState(false);
  const globalHooks = useContext(GlobalHooksContext);
  const modalContext = useContext(ModalContext);

  /**
 * stakingRewards = true means it uses Delta Staking Rewards
 * otherwize the mature delta from wallet 
 */
  const onTopUp = async (amount, amountBN) => {
    // TODO: add web3 topup operation using amountBN
    modalContext.closeModal();
  };

  const TOP_UP_DOWNGRADE_REFRESH_RATE = 1 * 60 * 1000;
  const [timeleftUntilDowngrade, setTimeleftUntilDowngrade] = useState({
    days: DATA_UNAVAILABLE,
    hours: DATA_UNAVAILABLE,
    minutes: DATA_UNAVAILABLE
  });

  useEffect(() => {
    const update = () => {
      setTimeleftUntilDowngrade(time.getTimeLeft(globalHooks.blockInfo.block.timestamp, globalHooks.staking.deltaInfo.timeUntilDowngrade));
    };

    if (globalHooks.staking.deltaInfo.timeUntilDowngrade !== DATA_UNAVAILABLE) {
      update();
    }

    const interval = setInterval(update, TOP_UP_DOWNGRADE_REFRESH_RATE);
    return () => clearInterval(interval);
  }, [globalHooks.staking.deltaInfo.timeUntilDowngrade]);

  return <DeltaPanel>
    <div className="my-4 text-base">A weekly deposit of 10% of your principle is necessary to maintain the multiplier. You can use Delta staking rewards or mature Delta from your wallet to top up the multiplier.</div>
    <div>Reward Multiplier</div>
    <div><ProgressBarDiamonds small value={globalHooks.staking.deltaInfo.rewardMultiplier} maxValue={10} /></div>
    {/* <div>Time until downgrade: {timeleftUntilDowngrade.days} day(s) {timeleftUntilDowngrade.hours} hour(s) {timeleftUntilDowngrade.minutes} minutes(s)</div> */}
    <div className="mt-4">
      <DeltaPanel className="flex flex-grow text-center">
        <div className="flex flex-row border border-black p-1 flex-grow">
          <DeltaButton className="flex mr-2 flex-1" onClick={() => setFromStakingRewards(t => !t)} grayLook={fromStakingRewards}>Delta staking rewards</DeltaButton>
          <DeltaButton className="flex flex-1" onClick={() => setFromStakingRewards(t => !t)} grayLook={!fromStakingRewards}>Mature delta from wallet</DeltaButton>
        </div>
      </DeltaPanel>
      <TokenInput
        className="mt-4"
        token="delta"
        buttonText="top up"
        transactionButtonNoBorders
        transactionButtonUnder
        disableTransactionWhenInvalid
        buttonTextLoading="Loading..."
        onOk={onTopUp} />
    </div>
  </DeltaPanel>;
}

const RlpTokenVault = ({ className = '' }) => {
  const token = 'rLP';

  return <div className={`mt-4 md:mt-2 ${className}`}>
    <DeltaTitleH2 lineunder>{token} Token</DeltaTitleH2>
    <DeltaPanel className="mt-4 flex flex-col-reverse md:flex-row">
      <div className="flex w-full flex-grow flex-col md:flex-col">
        <div>
          {/* <VaultInfoBox className="flex flex-stretch mr-0 md:mr-24" token={token} /> */}
          <RlpStats />
        </div>
      </div>
      <div className="w-full flex-grow hidden flex-col md:flex self-start">
        <ProgressBarDiamonds value={10} maxValue={10} className="flex flex-grow w-full hidden" />
      </div>
    </DeltaPanel>
    <VaultStaking token={token} />
  </div>;
};

const DeltaTokenVault = ({ className = '' }) => {
  const token = 'delta';
  const globalHooks = useContext(GlobalHooksContext);
  const modalContext = useContext(ModalContext);
  const rewardMultiplierDescription = 'Every week 10% of the principle needs to be deposited in the DFV to keep the Multiplier stable';

  const onDepositToMultiplier = async () => {
    await modalContext.showMessage('Top Up Reward Multiplier', <TopUpDialogContent />, false);
  };

  return <div className={`mt-4 md:mt-2 ${className}`}>
    <DeltaTitleH2 lineunder>{token} Token</DeltaTitleH2>
    <DeltaPanel className="mt-4 flex flex-col-reverse md:flex-row">
      <div className="flex w-full flex-grow flex-col md:flex-col">
        <div>
          {/* <VaultInfoBox className="flex flex-stretch mr-0 md:mr-24" token={token} /> */}
          <DeltaStats />
        </div>
        <div className="flex w-full flex-col flex-grow mt-4 md:hidden">
          <div className="text-xs flex mb-1">Reward Multiplier</div>
          <ProgressBarDiamonds value={globalHooks.staking.info.booster} maxValue={10} className="flex w-full flex-grow" />
          <div className="text-xs text-gray-400 flex mt-1">{rewardMultiplierDescription}</div>
          <DeltaButton secondaryLook className="mt-4" onClick={onDepositToMultiplier}>Deposit to multipler</DeltaButton>
        </div>
      </div>
      <div className="w-full flex-grow hidden flex-col md:flex self-start">
        <ProgressBarDiamonds value={globalHooks.staking.info.booster} maxValue={10} className="flex flex-grow w-full" />
        <div className="flex flex-row mt-4">
          <div className="text-xs flex flex-grow w-full">Reward Multiplier</div>
          <div className="text-xs flex text-gray-400">{rewardMultiplierDescription}</div>
        </div>
        {/* <DeltaButton secondaryLook className="mt-4" onClick={onDepositToMultiplier}>Deposit to multiplier</DeltaButton> */}
      </div>
    </DeltaPanel>
    <VaultStaking token={token} />
  </div>;
};

const Vault = () => {
  const router = useRouter()

  const seeWithdrawingContract = e => {
    e.preventDefault();
    router.push('/contracts');
  };

  return <DeltaSection requiresConnectedWallet showConnectWalletButton title="Delta Farming Vault">
    <DeltaPanel className="md:mt-0">
      <div className="md:mt-0">
        <div className="flex flex-col md:flex-row-reverse">
          <DeltaPanel className="w-full mt-4 mb-4 text-2xl text-semibold text-center w-full pr-0 md:pr-12 hidden">
            <div className="border border-black py-2 bg-gray-200 mb-1">Up to 750 % APY*</div>
            {/**
             * TODO: Hidden for now as getting the TVL requires getting
             * the information on a second market.
             */}
            <div className="border border-black py-2 bg-gray-200">TVL: $145,223,123</div>
          </DeltaPanel>
          <DeltaPanel className="mt-4 pr-12 text-lg">
            The Deep Farming Vault distributes<br />
            yield to staked rLP and Delta.
          </DeltaPanel>
        </div>
        <DeltaButton className="my-4 md:mb-12 md:mt-4" onClick={seeWithdrawingContract}>See all withdrawal contracts</DeltaButton>
        <RlpTokenVault />
        <DeltaTokenVault className="mt-8 md:mt-12" />
      </div>
    </DeltaPanel>
  </DeltaSection>;
};


export default Vault;