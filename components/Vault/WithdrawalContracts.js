import { useContext, useState } from 'react';
import { ModalContext } from '../../contexts';
import { GlobalHooksContext } from '../../contexts/GlobalHooks';
import { formatting, vesting } from '../../helpers';

import DeltaButton from '../Button/DeltaButton';
import { VestingTransactionProgressBar } from '../ProgressBar';
import { DeltaPanel, DeltaSectionBox } from '../Section';

const FinalizeContractDialogContent = ({ contract }) => {
  return <DeltaPanel>
    <div className="my-4 border border-black p-2 bg-gray-300">
      <div className="flex">
        <div className="flex flex-grow border-b border-black text-xl">
          {contract.mature}
        </div>
        <div className="flex self-stretch">
          <div className="flex self-end uppercase ml-1">Mature DELTA</div>
        </div>
      </div>
    </div>
    <div className="mt-4">
      Your {contract.immature} immature Delta will be distributed back to the Deep Farming Vault.
    </div>
    <div className="mt-2">This process cannot be undone.</div>
  </DeltaPanel>;
};

const WithdrawalContractItem = ({ index, opened, contract, className, onOpen }) => {
  const modelContext = useContext(ModalContext);
  const vestingTimeLeft = vesting.getVestingTimeLeft(contract.fullVestingTimestamp);

  const onFinalizeWithdrawal = async () => {
    const confirmed = await modelContext.showConfirm('You are finalizing your Withdrawal while having unmature Delta Rewards.', <FinalizeContractDialogContent />, 'Finalize Withdrawal');

    if (confirmed) {
      // TODO: add web3 call
      // TODO: update staking hook with update
    }
  };

  return <DeltaSectionBox showIndex opened={opened} className={className} index={index} indexFormatter={i => i + 1} title='Withdrawal Contract' onOpen={onOpen} >
    <div className="mt-4">Delta is continuously maturing in the  Withdrawal contract. The Vesting cycle to fully mature your rewards is one year. Finalizing the withdrawal will distribute your unmatured Delta to the Deep Farming Vault. You will receive your matured Delta (minimum 5% of total Rewards)</div>
    <div className="mt-4 mb-2">
      <div>Time until fully matured:</div>
      <div>{vestingTimeLeft.days} Day(s) {vestingTimeLeft.hours} Hour(s) {vestingTimeLeft.minutes} Minute(s)</div>
    </div>
    <VestingTransactionProgressBar transaction={contract} />
    <div className="ml-1 mt-1">{formatting.getTokenAmount(contract.mature, 18, 4)} / {formatting.getTokenAmount(contract.immature, 18, 4)}  mature</div>
    <DeltaButton className="mt-4" onClick={onFinalizeWithdrawal}>FINALIZING WITHDRAWAL</DeltaButton>
  </DeltaSectionBox >;
}

const WithdrawalContracts = () => {
  const globalHooks = useContext(GlobalHooksContext);
  const [currentOpened, setCurrentOpened] = useState(0);

  const onOpen = index => {
    setCurrentOpened(index);
  };

  return <DeltaPanel>
    {globalHooks.staking.withdrawalContracts.map((contract, index) => <WithdrawalContractItem opened={index === currentOpened} className="mt-4" index={index} key={`contract-${index}`} contract={contract} onOpen={onOpen} />)}
  </DeltaPanel>
};

export default WithdrawalContracts;