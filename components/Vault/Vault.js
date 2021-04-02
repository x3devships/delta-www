import { useContext } from 'react';
import { useWallet } from 'use-wallet';
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

const RlpStats = () => {
  const globalHooks = useContext(GlobalHooksContext);
  const isCmpBurn = globalHooks.staking.info.compoundBurn;

  return <div className="mt-4 md:mt-0">
    <ul className="list-disc list-inside py-4 md:py-8">
      <li>Total rLP: {formatting.getTokenAmount(globalHooks.rlpInfo.balance + (globalHooks.staking.info.rlp.toString() / 1e18), 0, 4)} rLP</li>
      <li>Unstaked rLP: {formatting.getTokenAmount(globalHooks.rlpInfo.balance, 0, 4)} rLP</li>
      <li>Staked rLP: {formatting.getTokenAmount(globalHooks.staking.info.rlp, 18, 4)} rLP</li>
      <DeltaTitleH4 className="mt-4">Rewards</DeltaTitleH4>
      <li>Ready to compound DELTA: {formatting.getTokenAmount(globalHooks.staking.info.farmedDelta, 18, 4)} DELTA</li>
      <li>Compounded DELTA: {formatting.getTokenAmount(globalHooks.staking.info.deltaVesting, 18, 4)} DELTA</li>
      {isCmpBurn && <li>Permanently Locked DELTA: {formatting.getTokenAmount(globalHooks.staking.info.deltaPermanent, 18, 4)} DELTA</li>}
      <li>Claimable ETH: {formatting.getTokenAmount(globalHooks.staking.info.farmedETH, 18, 4)} ETH</li>
    </ul>
  </div >
};

const DeltaStats = () => {
  const globalHooks = useContext(GlobalHooksContext);
  const isCmpBurn = globalHooks.staking.info.compoundBurn;

  return <div className="mt-4 md:mt-0">
    <DeltaTitleH4>Your Wallet</DeltaTitleH4>
    <ul className="list-disc list-inside">
      <li>Total DELTA: {formatting.getTokenAmount(globalHooks.delta.data.total, 0, 4)} DELTA</li>
      <li>Mature DELTA: {formatting.getTokenAmount(globalHooks.delta.data.mature, 0, 4)} DELTA</li>
      <li>Immature DELTA: {formatting.getTokenAmount(globalHooks.delta.data.immature, 0, 4)} DELTA</li>
    </ul>
    <DeltaTitleH4 className="mt-4">Staking</DeltaTitleH4>
    <ul className="list-disc list-inside  pb-4 md:pb-8">
      <li>Staked DELTA: {formatting.getTokenAmount(globalHooks.staking.info.totalDelta, 18, 4)} DELTA</li>
      {!isCmpBurn && <li>Permanently Locked DELTA: {formatting.getTokenAmount(globalHooks.staking.info.deltaPermanent, 18, 4)} DELTA</li>}
      <DeltaTitleH4 className="mt-4">Rewards</DeltaTitleH4>
      <li>Ready to compound DELTA: {formatting.getTokenAmount(globalHooks.staking.info.farmedDelta, 18, 4)} DELTA</li>
      <li>Compounded DELTA: {formatting.getTokenAmount(globalHooks.staking.info.deltaVesting, 18, 4)} DELTA</li>
      {isCmpBurn && <li>Permanently Locked DELTA: {formatting.getTokenAmount(globalHooks.staking.info.deltaPermanent, 18, 4)} DELTA</li>}
      <li>Claimable ETH: {formatting.getTokenAmount(globalHooks.staking.info.farmedETH, 18, 4)} ETH</li>

    </ul>
  </div >
};

/**
 * Only for the delta token
 */
/* const TopUpDialogContent = () => {
  const [fromStakingRewards, setFromStakingRewards] = useState(false);
  const globalHooks = useContext(GlobalHooksContext);
  const modalContext = useContext(ModalContext);

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
*/

const RlpTokenVault = ({ className = '' }) => {
  const token = 'rLP';

  return <div className={`mt-4 md:mt-2 ${className}`}>
    <DeltaTitleH2 lineunder>rLP Token</DeltaTitleH2>
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
  // const modalContext = useContext(ModalContext);
  const rewardMultiplierDescription = 'Every week 10% of the principle needs to be deposited in the DFV to keep the Multiplier stable';

  /* const onDepositToMultiplier = async () => {
    await modalContext.showMessage('Top Up Reward Multiplier', <TopUpDialogContent />, false);
  }; */

  return <div className={`mt-4 md:mt-2 ${className}`}>
    <DeltaTitleH2 lineunder>DELTA Token</DeltaTitleH2>
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
          {/* <DeltaButton secondaryLook className="mt-4" onClick={onDepositToMultiplier}>Deposit to multipler</DeltaButton> */}
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

  return <>
    <DeltaSection requiresConnectedWallet showConnectWalletButton title="Delta Farming Vault">
      <DeltaPanel className="md:mt-0">
        <div className="md:mt-0">
          <div className="flex flex-col md:flex-row-reverse">
            <DeltaPanel className="w-full mt-4 mb-4 text-2xl text-semibold text-center w-full pr-0 md:pr-12">
              <div className="border border-black py-2 bg-gray-200 mb-1">up to {apy.eth_yearly_delta} % APY</div>
              <div className="mt-1 text-xs text-left md:text-right">* Estimated yearly average returns when farming DELTA with a 10x booster</div>
            </DeltaPanel>
            <DeltaPanel className="my-4 text-lg">
              The Deep Farming Vault distributes<br />
            yield to staked rLP and Delta.
          </DeltaPanel>
          </div>
          <DeltaPanel className="my-4 mb-6 text-lg block">
            More information about how to use the Deep Farming Vault <br />is available at the Document Portal.
          <div className="block md:flex">
              <a target="_blank" href={gitbookUrl} rel="noopener noreferrer">
                <DeltaButton className="mt-4 block md:flex">Delta Document Portal</DeltaButton>
              </a>
            </div>
          </DeltaPanel>
          <RlpTokenVault />
          <DeltaTokenVault className="mt-8 md:mt-12" />
        </div>
      </DeltaPanel>
    </DeltaSection>
    <DeltaSection requiresConnectedWallet showConnectWalletButton title="Distribute Rewards">
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
    </DeltaSection>
  </>;
};


export default Vault;