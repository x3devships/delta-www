import { useContext, useState } from 'react';
import { useWallet } from 'use-wallet';
import { ModalContext } from '../../contexts';
import { GlobalHooksContext } from '../../contexts/GlobalHooks';
import { formatting, time, transactions } from '../../helpers';

import DeltaButton from '../Button/DeltaButton';
import { VestingTransactionProgressBar } from '../ProgressBar';
import { DeltaPanel, DeltaSection, DeltaSectionBox } from '../Section';

import { useWithdrawal } from '../../hooks';
import { DATA_UNAVAILABLE } from '../../config';
import { Spinner } from '../Spinner';

const FinalizeContractDialogContent = ({ contract }) => {
  return <DeltaPanel>
    <div className="my-4 border border-black p-2 bg-gray-200">
      <div className="flex">
        <div className="flex flex-grow border-b border-black text-xl">
          <div className="flex flex-grow" />
          <div className="flex">{formatting.getTokenAmount(contract.mature, 18, 4)}</div>
        </div>
        <div className="flex self-stretch">
          <div className="flex self-end uppercase ml-4">Mature DELTA</div>
        </div>
      </div>
    </div>
    <div className="mt-4">
      Your {formatting.getTokenAmount(contract.immature, 18, 4)} immature Delta will be distributed back to the Deep Farming Vault.
    </div>
    <div className="mt-2">This process cannot be undone.</div>
  </DeltaPanel>;
};

const WithdrawalContractItem = ({ index, opened, contract, className, onOpen }) => {
  const globalHooks = useContext(GlobalHooksContext);
  const modalContext = useContext(ModalContext);
  const withdrawals = useWithdrawal();
  const wallet = useWallet();
  const timer = time.getTimeLeft(globalHooks.blockInfo.block.timestamp, globalHooks.blockInfo.block.timestamp + contract.secondsLeftToMature);

  const onFinalizeWithdrawal = async (contract) => {
    const finalize = async () => {
      const transaction = await contract.methods.withdrawEverythingWithdrawable();

      await transactions.executeTransaction(
        modalContext,
        transaction,
        { from: wallet.account },
        "Contract successfully finalized. Your DELTA tokens are available in your wallet.",
        "Success",
        "Error while finalizing",
        "Finalizing...",
        "Finalizing your contract..."
      );

      await withdrawals.update();
    };

    if (contract.percentVested < 100) {
      // const confirmed = await modelContext.showConfirm('You are finalizing your Withdrawal while having immature Delta Rewards.', <FinalizeContractDialogContent contract={contract} />, 'Finalize Withdrawal');
      const confirm = await modalContext.showConfirm('Finalize', 'Are you sure you want to finalize the contract while still having immatured Delta ?');
      if (confirm) {
        return finalize();
      }
    }

    return finalize();
  };

  const onWithdrawPrinciple = async (contract) => {
    const transaction = await contract.methods.withdrawPrinciple();

    await transactions.executeTransaction(
      modalContext,
      transaction,
      { from: wallet.account },
      "Your principle has been withdrawn and the DELTA tokens are available in your wallet.",
      "Success",
      "Error while withdrawing",
      "Withdrawing...",
      "withdrawing your principle..."
    );

    await withdrawals.update();
  };

  const renderButtons = () => {
    if (!contract.principleWithdrawed) {
      const principleUnlockedCountdown = !contract.principleUnlocked ? time.getTimeLeft(globalHooks.blockInfo.block.timestamp, globalHooks.blockInfo.block.timestamp + contract.secondsLeftUntilPrincipleUnlocked) : '';
      const labelBottom = `unlocked ${principleUnlockedCountdown.toNow}`;

      return <>
        <DeltaButton className="flex-1 mr-4 md:flex-grow-0" disabled={!contract.principleUnlocked} labelBottom={labelBottom} onClick={() => onWithdrawPrinciple(contract)}>WITHDRAW PRINCIPLE</DeltaButton>
        <DeltaButton className="flex-1 md:flex-grow-0" labelBottom="&nbsp;" onClick={() => onFinalizeWithdrawal(contract)}>FINALIZING WITHDRAWAL</DeltaButton>
      </>
    }

    return <>
      <DeltaButton className="mt-4" onClick={() => onFinalizeWithdrawal(contract)}>FINALIZING WITHDRAWAL</DeltaButton>
    </>
  }

  return <DeltaSectionBox showIndex opened={opened} className={className} index={index} indexFormatter={i => i + 1} title='Withdrawal Contract' onOpen={onOpen} >
    <div className="mt-4">Delta is continuously maturing in the  Withdrawal contract. The Vesting cycle to fully mature your rewards is one year. Finalizing the withdrawal will distribute your immatured Delta to the Deep Farming Vault. You will receive your matured Delta (minimum 5% of total Rewards)</div>
    <div className="mt-4 mb-2">
      <div>Time until fully matured:</div>
      <div>{timer.days} Day(s) {timer.hours} Hour(s) {timer.minutes} Minute(s)</div>
    </div>
    <VestingTransactionProgressBar transaction={contract} />
    {contract.hasVestingAmount && <div className="ml-1 mt-1">{formatting.getTokenAmount(contract.maturedVestingToken, 18, 4)} / {formatting.getTokenAmount(contract.vestingAmount, 18, 4)}  vesting DELTA</div>}
    {!contract.principleWithdrawed && <div className="ml-1 mt-1">{formatting.getTokenAmount(contract.principalAmount, 18, 4)} withdrawable principle DELTA</div>}

    <DeltaPanel className="flex items-center text-center flex-wrap mt-4">
      {renderButtons()}
    </DeltaPanel>
  </DeltaSectionBox>;
}

const WithdrawalContracts = () => {
  const withdrawals = useWithdrawal();
  const [currentOpened, setCurrentOpened] = useState(0);

  const onOpen = index => {
    setCurrentOpened(index);
  };

  const render = () => {
    if (withdrawals.withdrawalContracts === DATA_UNAVAILABLE) {
      return <Spinner />
    }

    if (withdrawals.withdrawalContracts.length === 0) {
      return <>You have no withdrawal contracts</>;
    }

    return withdrawals.withdrawalContracts.map((contract, index) =>
      <WithdrawalContractItem opened={index === currentOpened} className="mt-4" index={index} key={`contract-${index}`} contract={contract} onOpen={onOpen} />);
  };

  return <DeltaSection requiresConnectedWallet showConnectWalletButton title="Delta Withdrawal Contracts">
    <DeltaPanel>
      {render()}
    </DeltaPanel>
  </DeltaSection>
};

export default WithdrawalContracts;