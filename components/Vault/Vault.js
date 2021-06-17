import { useContext } from 'react';
import { useWallet } from 'use-wallet';
import BigNumber from 'bignumber.js';
import { DeltaPanel, DeltaSection } from '../Section';
import { DeltaTitleH2, DeltaTitleH4 } from '../Title';
import { ProgressBarDiamonds } from '../ProgressBar';
import VaultStaking from './VaultStaking';
import { GlobalHooksContext } from '../../contexts/GlobalHooks';
import { formatting, transactions } from '../../helpers';
import DeltaButton from '../Button/DeltaButton';
import { gitbookUrl } from '../../config';
import { useApy, useDistributor, useYam } from '../../hooks';
import TransactionButton from '../Button/TransactionButton';
import { ModalContext } from '../../contexts';
import { Tooltip, Tips } from '../Tooltip';

const RlpBalances = () => {
  const globalHooks = useContext(GlobalHooksContext);
  return (
    <div className="mt-4 md:mt-0">
      <DeltaTitleH4 className="flex" tip={Tips.rLPToken}>rLP Token</DeltaTitleH4>
      <ul className="list-disc list-inside py-1" style={{ height: '90px' }} >
        <li>Total rLP: {formatting.getTokenAmount(globalHooks.rlpInfo.balance + (globalHooks.staking.info.rlp.toString() / 1e18), 0, 4)} rLP</li>
      </ul>
    </div>
  );
};

const DeltaStats = () => {
  const globalHooks = useContext(GlobalHooksContext);
  const isCmpBurn = globalHooks.staking.info.compoundBurn;

  return <div className="mt-4 md:mt-0">
    <DeltaTitleH4 className='flex' tip={Tips.deltaToken}>DELTA Token</DeltaTitleH4>
    <ul className="list-disc list-inside py-1" style={{ height: '90px' }}>
      <li>Immature DELTA: {formatting.getTokenAmount(globalHooks.delta.data.immature, 0, 4)} DELTA<Tooltip inline tip={Tips.immature} /></li>
      <li>Mature DELTA: {formatting.getTokenAmount(globalHooks.delta.data.mature, 0, 4)} DELTA<Tooltip inline tip={Tips.mature} /></li>
      <li>Total DELTA: {formatting.getTokenAmount(globalHooks.delta.data.total, 0, 4)} DELTA</li>
    </ul>
  </div >
};

const DeltaStakingStats = () => {
  const globalHooks = useContext(GlobalHooksContext);
  const {
    deltaPermanent,
    deltaVesting,
    compoundBurn: isCmpBurn,
    totalDelta
  } = globalHooks.staking.info;

  const normalDeltaStaked = BigNumber.isBigNumber(totalDelta) ?
    totalDelta.minus(BigNumber.isBigNumber(deltaVesting) ? deltaVesting : 0)
      .minus(BigNumber.isBigNumber(deltaPermanent) ? deltaPermanent : 0) : '--';

  return <div className="mt-4 md:mt-0">
    <DeltaTitleH4 className='flex' tip={Tips.deltaToken}>DELTA Staking</DeltaTitleH4>
    <ul className="list-disc list-inside py-1" style={{ height: '114px' }}>
      <li>Staked Mature DELTA: {formatting.getTokenAmount(normalDeltaStaked, 18, 4)} DELTA</li>
      <li>Compounded DELTA: {formatting.getTokenAmount(deltaVesting, 18, 4)} DELTA</li>
      <li>Permanently Locked DELTA: {formatting.getTokenAmount(deltaPermanent, 18, 4)} DELTA <Tooltip inline tip={Tips.permaLock} /></li>
      <li>Total Staked DELTA: {formatting.getTokenAmount(totalDelta, 18, 4)} DELTA</li>
    </ul>
  </div>
};

const RewardsPanel = () => {
  const globalHooks = useContext(GlobalHooksContext);
  const {
    compoundBurn: isCmpBurn
  } = globalHooks.staking.info;
  const {
    farmedDelta,
    farmedETH
  } = globalHooks.staking.info;
  return <div className="mt-4 md:mt-0">
    <DeltaTitleH4 className='flex mt-4' tip={Tips.rewards}>DELTA and ETH Rewards</DeltaTitleH4>
    <ul className="list-disc list-inside pb-4 md:pb-8">
      <li>Ready to compound DELTA: {formatting.getTokenAmount(farmedDelta, 18, 4)} DELTA</li>
      <li>Claimable ETH: {formatting.getTokenAmountAsStrWithMinPrecision(farmedETH, 18, 4)} ETH</li>
    </ul>
  </div>
};

const RlpStakingStats = () => {
  const globalHooks = useContext(GlobalHooksContext);
  const {
    rlp
  } = globalHooks.staking.info;
  const {
    balance
  } = globalHooks.rlpInfo;
  return <div className="mt-4 md:mt-0">
    <DeltaTitleH4 className='flex' tip={Tips.deltaToken}>rLP Staking</DeltaTitleH4>
    <ul className="list-disc list-inside py-1" style={{ height: '114px' }}>
      <li>Unstaked rLP: {formatting.getTokenAmount(balance, 0, 4)} rLP</li>
      <li>Staked rLP: {formatting.getTokenAmount(rlp, 18, 4)} rLP</li>
    </ul>
  </div>
};

const DeltaStaking = () => {
  const globalHooks = useContext(GlobalHooksContext);
  const isCmpBurn = globalHooks.staking.info.compoundBurn;

  return (
    <div className="mt-4 md:mt-0">
      <DeltaTitleH2 className='mt-4 flex' tip={Tips.deltaRewards}>DELTA Rewards</DeltaTitleH2>
      <ul className="list-disc list-inside py-4" style={{ height: '90px' }}>
        <li>Ready to compound DELTA: {formatting.getTokenAmount(globalHooks.staking.info.farmedDelta, 18, 4)} DELTA</li>
        <li>Compounded DELTA: {formatting.getTokenAmount(globalHooks.staking.info.deltaVesting, 18, 4)} DELTA</li>
        <li>Permanently Locked DELTA: {formatting.getTokenAmount(globalHooks.staking.info.deltaPermanent, 18, 4)} DELTA</li>
        <li>Claimable ETH: {formatting.getTokenAmount(globalHooks.staking.info.farmedETH, 18, 4)} ETH</li>
      </ul>
    </div>
  );
};

const DeltaMultiplier = () => {
  const globalHooks = useContext(GlobalHooksContext);
  const deltaRewardMultiplierDescription = 'Every week 10% of the principle needs to be deposited in the DFV to keep the Multiplier stable';
  return (
    <div className="flex w-full flex-col flex-grow mt-0">
      <DeltaTitleH4 className="mt-0">DELTA Reward Multiplier<Tooltip inline tip={Tips.deltaRewardMultiplier} /></DeltaTitleH4>
      <ProgressBarDiamonds value={globalHooks.staking.info.booster} maxValue={10} className="flex w-full flex-grow mt-2" />
      <div className="text-xs text-gray-400 flex mt-1">{deltaRewardMultiplierDescription}</div>
    </div>
  );
};

const RlpMultiplier = () => {
  const rLPRewardMultiplierDescription = 'rLP has a estimated 200x multiplier that doesn\'t require any upkeep';
  return (
    <div className="w-full flex-grow flex-col md:flex mt-0 self-start">
      <DeltaTitleH4 className="mt-0">rLP Reward Multiplier<Tooltip inline tip={Tips.rLPRewardMultiplier} /></DeltaTitleH4>
      <ProgressBarDiamonds noUpkeepNeeded className="flex flex-grow w-full mt-2" />
      <div className="text-xs text-gray-400 flex mt-1">{rLPRewardMultiplierDescription}</div>
    </div>
  );
};

const VerticalLayout = ({ children }) => (
  <div className="w-full flex-grow flex-col md:flex self-start">
    {children}
  </div>
);

const VaultPanel = ({ className = '' }) => {
  const globalHooks = useContext(GlobalHooksContext);
  return <div className={`mt-4 md:mt-2 ${className}`}>
    <DeltaTitleH2 lineunder>Balances</DeltaTitleH2>
    <DeltaPanel className="mt-4 flex flex-col md:flex-row">
      <VerticalLayout>
        <div>
          <DeltaStats />
        </div>

        <div>
          <DeltaStakingStats />
        </div>

        <DeltaMultiplier />

      </VerticalLayout>

      <div className="vertical-line md:show-up" />

      <VerticalLayout>
        <div>
          <RlpBalances />
        </div>

        <div>
          <RlpStakingStats />
        </div>

        <RlpMultiplier />

      </VerticalLayout>

    </DeltaPanel>

    <DeltaPanel className='mt-4'>
      <DeltaTitleH2 lineunder>Rewards</DeltaTitleH2>
      <RewardsPanel />
    </DeltaPanel>

    <DeltaPanel className='mt-4'>
      <DeltaTitleH2 lineunder>Vault actions</DeltaTitleH2>
      <VaultStaking />
    </DeltaPanel>


  </div>;
};

const Vault = () => {
  const yam = useYam();
  const apy = useApy();
  const wallet = useWallet();
  const modalContext = useContext(ModalContext);
  const distributor = useDistributor();

  const onDistribute = async () => {
    const transaction = yam.contracts.distributor.methods.distribute();

    await transactions.executeTransaction(
      modalContext,
      transaction,
      { from: wallet.account },
      "Successfully distributed",
      "Distributing...",
      "Error while distributing"
    );

    distributor.update();
  };

  const onBurn = async () => {
    const transaction = yam.contracts.distributor.methods.distributeAndBurn();

    await transactions.executeTransaction(
      modalContext,
      transaction,
      { from: wallet.account },
      "Successfully burned",
      "Burning...",
      "Error while burning"
    );

    distributor.update();
  };

  const onClaim = async () => {
    const transaction = yam.contracts.distributor.methods.claimCredit();

    await transactions.executeTransaction(
      modalContext,
      transaction,
      { from: wallet.account },
      "Successfully claimed",
      "Claiming...",
      "Error while claiming"
    );

    distributor.update();
  };

  return <>
    <DeltaSection requiresConnectedWallet showConnectWalletButton title="DELTA Farming Vault">
      <DeltaPanel className="md:mt-0">
        <div className="md:mt-0">
          <div className="flex flex-col md:flex-row-reverse">
            <DeltaPanel className="w-full mt-4 mb-4 text-2xl text-semibold text-center w-full pr-0 md:pr-12">
              <div className="border border-black py-2 bg-gray-200 mb-1">up to {apy.eth_yearly_delta} % APY</div>
              <div className="mt-1 text-xs text-left md:text-right">* Estimated yearly average returns when farming DELTA with a 10x booster</div>
            </DeltaPanel>
            <DeltaPanel className="my-4 text-lg">
              The Deep Farming Vault distributes<br />
              yield to staked rLP and DELTA.
            </DeltaPanel>
          </div>

          <DeltaPanel className="my-4 mb-6 text-lg block">
            More information about how to use the Deep Farming Vault <br />is available at the Document Portal.
            <div className="block md:flex">
              <a target="_blank" href={gitbookUrl} rel="noopener noreferrer">
                <DeltaButton className="mt-4 block md:flex">DELTA Document Portal</DeltaButton>
              </a>
            </div>
          </DeltaPanel>

          <VaultPanel />
        </div>
      </DeltaPanel>
    </DeltaSection>

    <DeltaSection requiresConnectedWallet showConnectWalletButton title="Distributor">
      <DeltaPanel className="md:mt-0">
        <div className="py-2">
          <DeltaTitleH4 className="flex" tip={Tips.pendingDelta}>Pending claimable DELTA credits</DeltaTitleH4>
          <div className="my-4">{formatting.getTokenAmount(distributor.info.pendingCredits, 18, 4)} DELTA</div>
          <TransactionButton className="flex-1 mr-2 md:flex-grow-0" disabled={!distributor.info.hasPendingCredits} text={distributor.info.hasPendingCredits ? 'Claim' : 'Nothing to be claimed'} onClick={onClaim} />
        </div>
      </DeltaPanel>
    </DeltaSection>
    {/* <DeltaSection requiresConnectedWallet showConnectWalletButton title="Distribute Rewards">
      <DeltaPanel className="md:mt-0">
        <div className="py-2">
          <DeltaTitleH4>Ready To Distribute</DeltaTitleH4>
          {formatting.getTokenAmount(distributor.info.pendingToDistribute, 18, 4)} DELTA
          <TransactionButton className="flex-1 mr-2 md:flex-grow-0" disabled={!distributor.info.hasDeltaToDistribute} text={distributor.info.hasDeltaToDistribute ? 'Distribute' : 'Nothing to distribute'} onClick={onDistribute} />

        </div>
        <div className="py-2">
          <DeltaTitleH4>Ready To Burn</DeltaTitleH4>
          {formatting.getTokenAmount(distributor.info.pendingBurn, 18, 4)} DELTA
          <TransactionButton className="flex-1 mr-2 md:flex-grow-0" disabled={!distributor.info.hasDeltaToBurn} text={distributor.info.hasDeltaToBurn ? 'Burn' : 'Nothing to burn'} onClick={onBurn} />
        </div>
      </DeltaPanel>
      </DeltaSection> */}
  </>;
};


export default Vault;