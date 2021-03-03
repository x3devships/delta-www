/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
import { useContext, useState } from 'react';
import { useRouter } from 'next/router'
import { ModalContext } from '../../contexts';
import { GlobalHooksContext } from '../../contexts/GlobalHooks';
import { formatting } from '../../helpers';
import DeltaButton from '../Button/DeltaButton';
import TransactionButton from '../Button/TransactionButton';
import { TokenInput } from '../Input';
import { ProgressBarDiamonds } from '../ProgressBar';
import { DeltaPanel } from '../Section'

const RlpStaking = () => {
  const globalHooks = useContext(GlobalHooksContext);
  const modalContext = useContext(ModalContext);

  const onStake = async (amount, amountBN) => {
    const confirmed = await modalContext.showConfirm('Staking', `Are you sure you wanna stake ${amount} rLP ?`);

    if (confirmed) {
      // TODO: add web3 call, be sure to use amountBN
      // TODO: call the staking update method and user rlp balance
    }
  };

  return <div>
    <ul className="list-disc list-inside py-4 md:py-8">
      <li>Staked rLP: {formatting.getTokenAmount(globalHooks.staking.rlpInfo.amountStaked, 0, 4)} rLP</li>
      <li>Claimable ETH: {formatting.getTokenAmount(globalHooks.staking.rlpInfo.claimableEth, 0, 4)} ETH</li>
      <li>Claimable DELTA: {formatting.getTokenAmount(globalHooks.staking.rlpInfo.claimableDelta, 0, 4)} DELTA</li>
    </ul>

    <TokenInput className="mt-4" token="rLP" buttonText="Stake" buttonTextLoading="Staking..." onOk={() => onStake()} />
  </div >
};

const DeltaStaking = () => {
  const globalHooks = useContext(GlobalHooksContext);
  const modalContext = useContext(ModalContext);

  const onStake = async (amount, amountBN, valid) => {
    if (!valid) {
      await modalContext.showError('Error', 'Invalid input');
    } else {
      const confirmed = await modalContext.showConfirm('Staking', `Are you sure you wanna stake ${amount} rLP ?`);

      if (confirmed) {
        // TODO: add web3 call, be sure to use amountBN
        // TODO: call the staking update method and delta react hook update
      }
    }
  };

  return <div>
    <ul className="list-disc list-inside py-4 md:py-8">
      <li>Staked DELTA: {formatting.getTokenAmount(globalHooks.staking.deltaInfo.amountStaked, 0, 4)} rLP</li>
      <li>Claimable DELTA: {formatting.getTokenAmount(globalHooks.staking.deltaInfo.claimableEth, 0, 4)} ETH</li>
      <li>Claimable ETH: {formatting.getTokenAmount(globalHooks.staking.deltaInfo.claimableDelta, 0, 4)} DELTA</li>
    </ul>
    <TokenInput className="mt-4" token="delta" buttonText="Stake" buttonTextLoading="Staking..." onOk={() => onStake()} />
  </div >
};

const VaultDeposit = ({ token }) => {
  const [depositAction, setDepositAction] = useState(true);

  const renderContent = () => {
    if (depositAction) {
      return token === "rLP" ? <RlpStaking /> : <DeltaStaking />;
    }

    return <>Not Available</>;
  };

  return <div>
    <DeltaPanel className="flex items-center text-center flex-wrap">
      <div className="flex border border-black p-1 flex-grow md:flex-none">
        <DeltaButton className="flex-1 mr-2 md:flex-grow-0" onClick={() => setDepositAction(t => !t)} grayLook={!depositAction}>Stake</DeltaButton>
        <DeltaButton className="flex-1 md:flex-grow-0" onClick={() => setDepositAction(t => !t)} grayLook={depositAction}>Buy</DeltaButton>
      </div>
    </DeltaPanel>
    {renderContent()}
  </div>;
};


const CreateWithdrawalContractContent = ({ token }) => {
  let message = 'This will automatically claim 3.543 ETH and start a Withdrawal contract for 3245 Delta.'
  if (token === 'delta') {
    message = `${message} And reduce your Reward Multiplier to 1x.`
  }

  const claimDelta = 123;
  const claimEth = 432;

  return <DeltaPanel>
    <div className="my-4 text-base">{message}</div>
    <div className="my-4 text-base">Current Reward Multiplier:</div>
    <div>Reward Multiplier</div>
    <div><ProgressBarDiamonds small value={10} maxValue={10} /></div>
    <div>Time until downgrade: 6 days 13 hours</div>
  </DeltaPanel>;
}

const UnstakeDeltaDialogContent = () => {
  const onUnstake = async () => {
    // TODO: add web3 topup operation
    // TODO: call the staking update method and user's delta balance (delta update hook)
  };

  const claimDelta = 123;
  const claimEth = 432;

  return <DeltaPanel>
    <div className="mt-4">
      <TokenInput
        className="mt-4"
        token="delta"
        labelBottom={`This will automatically claim ${claimEth} ETH and start a Withdrawal contract for ${claimDelta} Delta. And reduce your Reward Multiplier to 1x.`}
        labelBottomClassName="mt-4"
        buttonText="UNSTAKE DELTA AND FINALIZE WITHDRAWAL"
        transactionButtonNoBorders
        transactionButtonUnder
        buttonTextLoading="Unstaking..."
        onOk={onUnstake} />
    </div>
  </DeltaPanel>;
}

const DeltaWithdrawal = ({ token }) => {
  const modalContext = useContext(ModalContext);
  const router = useRouter()

  const onCreateContract = async () => {
    const confirmed = await modalContext.showConfirm('Delta Withdrawal Contract', <CreateWithdrawalContractContent token={token} />, 'create withdrawal contract');

    if (confirmed) {
      // TODO: add web3 operation
      // TODO: call the staking update method to refresh the list of withdrawal contracts
    }
  };

  const onUnstakeDelta = async () => {
    await modalContext.showMessage('You are about to unstake your Delta', <UnstakeDeltaDialogContent />, false);
  };

  const seeWithdrawingContract = e => {
    e.preventDefault();
    router.push('/contracts');
  };

  return <div className="my-6">
    {token === 'delta' && <>
      <ul className="list-disc list-inside py-4 md:py-8">
        <li>Staked Delta: {formatting.getTokenAmount('543.777', 0, 4)} DELTA</li>
      </ul>
      <div className="flex p-1 flex-grow md:flex-none">
        <TransactionButton className="flex-1" text="unstake underlying delta" onClick={onUnstakeDelta} />
      </div>
    </>}
    <ul className="list-disc list-inside py-4 md:py-8">
      <li>Claimable Delta: {formatting.getTokenAmount('543.777', 0, 4)} DELTA</li>
    </ul>
    <div className="flex p-1 flex-grow md:flex-none">
      <TransactionButton className="flex-1 mr-2 md:flex-grow-0" text="Create Contract" onClick={onCreateContract} />
      <DeltaButton className="flex-1 md:flex-grow-0" onClick={seeWithdrawingContract}>Show All Contracts</DeltaButton>
    </div>
  </div>
};

const EthereumWithdrawal = () => {
  const onClaim = () => {
    // TODO: add web3 claim
    // TODO: call the staking update method and user eth balance
  };

  return <div className="my-6">
    <ul className="list-disc list-inside py-4 md:py-8">
      <li>Claimable Ethereum: {formatting.getTokenAmount('123.456', 0, 4)} ETH</li>
    </ul>
    <TransactionButton text="Claim" textLoading="Claiming..." onClick={onClaim} />
  </div>
};

const RlpWithdrawalDialogContent = () => {
  const claimEth = 3.543;
  const claimDelta = 3245;

  const confirmMessage = `This will automatically claim ${claimEth} ETH and start a Withdrawal contract for ${claimDelta} DELTA.`;

  const onUnstake = async () => {
    // TODO: add web3 topup operation
    // TODO: call the staking update method and user rLP token balance
  };

  return <DeltaPanel>
    <TokenInput
      className="mt-4"
      token="rLP"
      buttonText="UNSTAKE rLP AND FINALIZE WITHDRAWAL"
      transactionButtonUnder
      transactionButtonClassName="w-full md:8/12"
      transactionButtonNoBorders
      labelBottomClassName="mt-4"
      labelBottom={confirmMessage}
      buttonTextLoading="Unstaking..."
      onOk={() => onUnstake()} />
  </DeltaPanel>;
};

const RlpWithdrawal = () => {
  const modalContext = useContext(ModalContext);

  const onUnstakDialog = async () => {
    await modalContext.showMessage('You are about to unstake your rLP', <RlpWithdrawalDialogContent />, false);
  };

  return <div className="my-6">
    <ul className="list-disc list-inside py-4 md:py-8">
      <li>Staked rLP: {formatting.getTokenAmount('543.777', 0, 4)} rLP</li>
    </ul>
    <TransactionButton text="Unstake" textLoading="Unstaking..." onClick={onUnstakDialog} />
  </div>
};

const VaultWithdraw = ({ token, selectedTokenToWithdraw = 'eth', showWithdrawlContracts = false }) => {
  const [tokenToWithdraw, setTokenToWithdraw] = useState(selectedTokenToWithdraw);

  const renderContent = (selectTokenToWithdraw) => {
    switch (selectTokenToWithdraw) {
      case 'eth':
        return <EthereumWithdrawal />
      case 'delta':
        return <DeltaWithdrawal showWithdrawlContracts={showWithdrawlContracts} token={token} />
      case 'rlp':
        return <RlpWithdrawal />
      default:
        return <></>;
    }
  };

  const renderButtons = () => {
    if (token === 'delta') {
      return <>
        <DeltaButton className="flex-1 mr-2 md:flex-grow-0" onClick={() => setTokenToWithdraw('eth')} grayLook={tokenToWithdraw !== 'eth'}>Ethereum</DeltaButton>
        <DeltaButton className="flex-1 md:flex-grow-0" onClick={() => setTokenToWithdraw('delta')} grayLook={tokenToWithdraw !== 'delta'}>Delta</DeltaButton>
      </>;
    }

    return <>
      <DeltaButton className="flex-1 mr-2 md:flex-grow-0" onClick={() => setTokenToWithdraw('eth')} grayLook={tokenToWithdraw !== 'eth'}>Ethereum</DeltaButton>
      <DeltaButton className="flex-1 mr-2 md:flex-grow-0" onClick={() => setTokenToWithdraw('delta')} grayLook={tokenToWithdraw !== 'delta'}>Delta</DeltaButton>
      <DeltaButton className="flex-1 md:flex-grow-0" onClick={() => setTokenToWithdraw('rlp')} grayLook={tokenToWithdraw !== 'rlp'}>rLP</DeltaButton>
    </>;
  };

  return <div>
    <DeltaPanel className="flex items-center text-center flex-wrap">
      <div className="flex border border-black p-1 flex-grow md:flex-none">
        {renderButtons()}
      </div>
    </DeltaPanel>
    <DeltaPanel>
      {renderContent(tokenToWithdraw)}
    </DeltaPanel>
  </div>;
};

const VaultStaking = ({ token, className = '' }) => {
  const [depositAction, setDepositAction] = useState(true);

  return <DeltaPanel className={`pt-2 border-t-2 mt-4 border-dashed border-black ${className}`}>
    <div className="flex uppercase" onClick={() => setDepositAction(t => !t)}>
      <div className="flex flex-grow" />
      <div className="flex self-end select-none cursor-pointer text-sm">
        <div className={`${!depositAction ? 'text-gray-300' : 'text-black'}`}>Deposit</div>
        <div className="px-1">/</div>
        <div className={`${depositAction ? 'text-gray-300' : 'text-black'}`}>Withdraw</div>
      </div>
    </div>
    <div className="mt-4 md:mt-1">
      {depositAction ? <VaultDeposit token={token} /> : <VaultWithdraw token={token} />}
    </div>
  </DeltaPanel>
};

export default VaultStaking;
