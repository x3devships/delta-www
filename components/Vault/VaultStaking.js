/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
import { useContext, useEffect, useState } from 'react';
import { ModalContext } from '../../contexts';
import { GlobalHooksContext } from '../../contexts/GlobalHooks';
import { formatting } from '../../helpers';
import DeltaButton from '../Button/DeltaButton';
import TransactionButton from '../Button/TransactionButton';
import { TokenInput } from '../Input';
import { ProgressBarDiamonds } from '../ProgressBar';
import { DeltaPanel } from '../Section'

const onStake = (token) => {

};

const RlpStaking = () => {
  const globalHooks = useContext(GlobalHooksContext);

  return <div>
    <ul className="list-disc list-inside py-4 md:py-8">
      <li>Staked rLP: {formatting.getTokenAmount(globalHooks.rlpInfo.balance + globalHooks.staking.rlpStaked, 0, 4)} rLP</li>
      <li>Claimable ETH: {formatting.getTokenAmount(globalHooks.rlpInfo.balance, 0, 4)} ETH</li>
      <li>Claimable DELTA: {formatting.getTokenAmount(globalHooks.staking.rlpStaked, 0, 4)} DELTA</li>
    </ul>

    <TokenInput className="mt-4" token="rLP" buttonText="Stake" buttonTextLoading="Staking..." onOk={() => onStake('rlp')} />
  </div >
};

const DeltaStaking = () => {
  const globalHooks = useContext(GlobalHooksContext);

  return <div>
    <ul className="list-disc list-inside py-4 md:py-8">
      <li>Staked DELTA: {formatting.getTokenAmount(globalHooks.rlpInfo.balance + globalHooks.staking.rlpStaked, 0, 4)} rLP</li>
      <li>Claimable DELTA: {formatting.getTokenAmount(globalHooks.rlpInfo.balance, 0, 4)} ETH</li>
      <li>Claimable ETH: {formatting.getTokenAmount(globalHooks.staking.rlpStaked, 0, 4)} DELTA</li>
    </ul>
    <TokenInput className="mt-4" token="delta" buttonText="Stake" buttonTextLoading="Staking..." onOk={() => onStake('delta')} />
  </div >
};

const VaultDeposit = ({ token }) => {
  const [toggle, setToggle] = useState(false);

  return <div>
    <DeltaPanel className="flex items-center text-center flex-wrap">
      <div className="flex border border-black p-1 flex-grow md:flex-none">
        <DeltaButton className="flex-1 mr-2 md:flex-grow-0" onClick={() => setToggle(t => !t)} grayLook={toggle}>Stake</DeltaButton>
        <DeltaButton className="flex-1 md:flex-grow-0" onClick={() => setToggle(t => !t)} grayLook={!toggle}>Buy</DeltaButton>
      </div>
    </DeltaPanel>
    {token === "rLP" ? <RlpStaking /> : <DeltaStaking />}
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
    <div><ProgressBarDiamonds small minMultiplier={1} maxMultiplier={10} /></div>
    <div>Time until downgrade: 6 days 13 hours</div>
  </DeltaPanel>;
}

const UnstakeDeltaDialogContent = () => {
  const onUnstake = async () => {
    // TODO: add web3 topup operation
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

  const onCreateContract = async () => {
    const confirmed = await modalContext.showConfirm('Delta Withdrawal Contract', <CreateWithdrawalContractContent token={token} />, 'create withdrawal contract');

    if (confirmed) {
      // TODO: add web3 topup operation
    }
  };

  const onUnstakeDelta = async () => {
    await modalContext.showMessage('You are about to unstake your Delta', <UnstakeDeltaDialogContent />, false);
  };

  const onSelectAllContracts = () => {

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
      <TransactionButton className="flex-1 md:flex-grow-0" text="Select All Contracts" onClick={onSelectAllContracts} />
    </div>
  </div>
};

const EthereumWithdrawal = () => {
  const onClaim = () => {
    // TODO: add web3 claim
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
  };

  return <DeltaPanel>
    <TokenInput
      className="mt-4"
      token="rLP"
      buttonText="UNSTAKE rLP AND FINALIZE WITHDRAWAL"
      transactionButtonUnder
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

const VaultWithdraw = ({ token }) => {
  const [tokenToWithdraw, setTokenToWithdraw] = useState('eth');

  const renderContent = (selectTokenToWithdraw) => {
    switch (selectTokenToWithdraw) {
      case 'eth':
        return <EthereumWithdrawal />
      case 'delta':
        return <DeltaWithdrawal token={token} />
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

const VaultStaking = ({ token, showAllWithdrawalContracts, className = '' }) => {
  const [depositAction, setDepositAction] = useState(true);

  // TODO: Should toggle on showAllWithdrawalContracts value change
  /* useEffect(() => {
    setDepositAction(!showAllWithdrawalContracts);
  }, [showAllWithdrawalContracts]); */

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
