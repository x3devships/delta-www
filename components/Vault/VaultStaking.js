/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
import { useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/router'
import { useWallet } from 'use-wallet';
import { ModalContext } from '../../contexts';
import { GlobalHooksContext } from '../../contexts/GlobalHooks';
import { formatting, transactions } from '../../helpers';
import DeltaButton from '../Button/DeltaButton';
import TransactionButton from '../Button/TransactionButton';
import { DeltaCheckboxButton, TokenInput } from '../Input';
import { ProgressBarDiamonds } from '../ProgressBar';
import { CompoundBurnCheckbox, DeltaCheckbox } from '../CheckBox';
import { DeltaPanel } from '../Section'
import { DATA_UNAVAILABLE } from '../../config';
import { useRlpRouter, useYam } from '../../hooks';

const RlpStaking = () => {
  const globalHooks = useContext(GlobalHooksContext);
  const modalContext = useContext(ModalContext);
  const yam = useYam();
  const wallet = useWallet();

  const onStake = async (amount, amountBN) => {

    const confirmed = await modalContext.showConfirm('Staking', `Are you sure you wanna stake ${amount} rLP ?`);

    if (confirmed) {
      const transaction = yam.contracts.dfv.methods.deposit(amountBN, 0);

      await transactions.executeTransaction(
        modalContext,
        transaction,
        { from: wallet.account },
        "Successfully staked",
        "Stake",
        "Error while staking"
      );

      globalHooks.staking.update();
      globalHooks.rlpInfo.update();
    }
  };

  return <div>
    <TokenInput className="mt-4" token="rLP" buttonText="Stake" buttonTextLoading="Staking..." onOk={onStake} />
  </div >
};

const DeltaStaking = () => {
  const globalHooks = useContext(GlobalHooksContext);
  const modalContext = useContext(ModalContext);
  const yam = useYam();
  const wallet = useWallet();
  const [burning, setBurning] = useState(true);

  const onStake = async (amount, amountBN, valid) => {
    if (!valid) {
      await modalContext.showError('Error', 'Invalid input');
    } else {
      const confirmed = await modalContext.showConfirm('Staking', burning ? `Are you sure you wanna stake ${amount} Delta with 50% burning ?` : `Are you sure you wanna stake ${amount} Delta ?`);

      if (confirmed) {
        const transaction = burning ? yam.contracts.dfv.methods.depositWithBurn(amountBN) : yam.contracts.dfv.methods.deposit(0, amountBN);

        await transactions.executeTransaction(
          modalContext,
          transaction,
          { from: wallet.account },
          "Successfully staked",
          "Stake",
          "Error while staking"
        );

        globalHooks.staking.update();
        globalHooks.delta.update();
      }
    }
  };

  return <div>
    <TokenInput className="mt-4" token="delta" buttonText="Stake" buttonTextLoading="Staking..." onOk={onStake} />
    <div className="flex">
      <DeltaCheckbox className="flex items-center text-center flex-wrap" label="Deposit Burn" onChange={() => setBurning(c => !c)} />
      <CompoundBurnCheckbox
        className="flex items-center text-center flex-wrap"
      />
    </div>
  </div >
};

const RlpMinting = () => {
  const router = useRlpRouter();
  const [estimationLabel, setEstimationLabel] = useState('');

  useEffect(() => {
    const text = `estimated rLP minted: ${formatting.getTokenAmount(router.estimatedRlpAmount, 0, 4)} ` +
      `rLP ➔ Gas cost: ${formatting.getTokenAmount(router.gasEstimation, 18, 4)} ETH`;
    setEstimationLabel(text);
  }, [router.estimatedRlpAmount, router.gasEstimation]);

  const onBuy = async (amount, amountBN, autoStake) => {
    if (amount !== DATA_UNAVAILABLE) {
      router.setAutoStake(autoStake);
      await router.mint(false);
    }
  };

  const onChange = async (amount, amountBN, autoStake) => {
    if (amount !== DATA_UNAVAILABLE) {
      router.setAutoStake(autoStake);
      await router.setEthAmountOnly(amount);
    }
  };

  return <div>
    <ul className="list-disc list-inside py-4 md:py-8">
      <li>Deposit Ethereum to mint new rLP tokens</li>
      <li>Select stake automatically to immediately stake the new rLP in the Deep Farming Vault</li>
    </ul>
    <TokenInput
      className="mt-4"
      token="ETH"
      buttonText="Buy"
      onChange={onChange}
      labelBottom={estimationLabel}
      buttonTextLoading="Buying..."
      checkboxButton="Stake"
      onOk={onBuy} />
  </div>;
};

const VaultDeposit = ({ token }) => {
  const [depositAction, setDepositAction] = useState(true);

  const renderContent = () => {
    switch (token) {
      case "rLP":
        if (depositAction) {
          return <RlpStaking />
        }
        return <RlpMinting />;
      case "delta":
        if (depositAction) {
          return <DeltaStaking />;
        }
        break;
      default:
        break;
    }
  };

  const renderBuyButton = (token) => {
    if (token === "rLP") {
      return <DeltaButton className="flex-1 md:flex-grow-0"
        onClick={() => setDepositAction(t => !t)}
        grayLook={depositAction}>Buy</DeltaButton>
    }

    return <a className="flex-1 md:flex-grow-0" target="_blank" href="https://app.uniswap.org/#/swap" rel="noopener noreferrer">
      <DeltaButton grayLook={depositAction}>Buy On Uniswap</DeltaButton>
    </a>;
  }

  return <div>
    <DeltaPanel className="flex items-center text-center flex-wrap">
      <div className="flex border border-black p-1 flex-grow md:flex-none">
        <DeltaButton className="flex-1 mr-2 md:flex-grow-0" onClick={() => setDepositAction(t => !t)} grayLook={!depositAction}>Stake</DeltaButton>
        {renderBuyButton(token)}
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

  // TODO: Read from web3
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
  const globalHooks = useContext(GlobalHooksContext);
  const onUnstake = async () => {
    // TODO: add web3 topup operation
    globalHooks.staking.update();
    globalHooks.delta.update();
  };

  // TODO: Read from web3
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
  const globalHooks = useContext(GlobalHooksContext);
  const modalContext = useContext(ModalContext);
  const router = useRouter()

  const onCreateContract = async () => {
    const confirmed = await modalContext.showConfirm('Delta Withdrawal Contract', <CreateWithdrawalContractContent token={token} />, 'create withdrawal contract');

    if (confirmed) {
      // TODO: add web3 operation
      globalHooks.staking.update();
    }
  };

  const onUnstakeDelta = async () => {
    await modalContext.showMessage('You are about to unstake your Delta', <UnstakeDeltaDialogContent />, false);
  };

  const seeWithdrawingContract = e => {
    e.preventDefault();
    router.push('/contracts');
  };

  const getClaimableDelta = () => {
    if (token === 'delta') {
      return globalHooks.staking.info.farmedDelta;
    }

    return globalHooks.staking.info.farmedDelta;
  };

  return <div className="my-6">
    {token === 'delta' && <>
      <ul className="list-disc list-inside py-4 md:py-8">
        <li>Staked Delta: {formatting.getTokenAmount(globalHooks.staking.deltaInfo.totalDelta, 18, 4)} DELTA</li>
      </ul>
      <div className="flex p-1 flex-grow md:flex-none">
        {/* <TransactionButton className="flex-1" text="unstake underlying delta" onClick={onUnstakeDelta} /> */}
      </div>
    </>}
    <ul className="list-disc list-inside py-4 md:py-8">
      <li>Claimable Delta: {formatting.getTokenAmount(getClaimableDelta(), 18, 4)} DELTA</li>
    </ul>
    <div className="flex p-1 flex-grow md:flex-none">
      {/* <TransactionButton className="flex-1 mr-2 md:flex-grow-0" text="Create Contract" onClick={onCreateContract} /> */}
      <DeltaButton className="flex-1 md:flex-grow-0" onClick={seeWithdrawingContract}>Show All Contracts</DeltaButton>
    </div>
  </div>
};

const EthereumWithdrawal = ({ token }) => {
  const globalHooks = useContext(GlobalHooksContext);
  const yam = useYam();
  const wallet = useWallet();
  const modalContext = useContext(ModalContext);

  const onClaim = async () => {
    if (globalHooks.staking.info.compoundBurn === DATA_UNAVAILABLE) {
      return Promise.reject();
    }

    let transaction = yam.contracts.dfv.methods.deposit(0, 0);
    if (globalHooks.staking.info.compoundBurn) {
      transaction = yam.contracts.dfv.methods.depositWithBurn(0);
    }

    await transactions.executeTransaction(
      modalContext,
      transaction,
      { from: wallet.account },
      "Successfully claimed",
      "Claim",
      "Error while claiming"
    );

    globalHooks.staking.update();
    globalHooks.delta.update();
  };

  const getClaimableEth = () => {
    if (token === 'delta') {
      return globalHooks.staking.info.farmedETH;
    }

    return globalHooks.staking.info.farmedETH;
  };

  return <div className="my-6">
    <ul className="list-disc list-inside py-4 md:py-8">
      <li>Claimable Ethereum: {formatting.getTokenAmount(getClaimableEth(), 18, 4)} ETH</li>
    </ul>
    <TransactionButton text="Claim" textLoading="Claiming..." onClick={onClaim} />
  </div>
};

const RlpWithdrawalDialogContent = () => {
  const globalHooks = useContext(GlobalHooksContext);
  const yam = useYam();
  const wallet = useWallet();
  const modalContext = useContext(ModalContext);

  const confirmMessage = `This will automatically claim your farmed ETH and start a Withdrawal contract for your farmed DELTA.`;

  const onUnstake = async () => {
    const transaction = yam.contracts.dfv.methods.withdrawRLP(globalHooks.staking.info.rlp);

    await transactions.executeTransaction(
      modalContext,
      transaction,
      { from: wallet.account },
      "Successfully unstaked",
      "Unstake",
      "Error while unstaking"
    );

    globalHooks.staking.update();
    globalHooks.rlpInfo.update();
  };

  return <DeltaPanel>
    <TokenInput
      className="mt-4"
      token="rLP"
      // buttonText="UNSTAKE rLP AND FINALIZE WITHDRAWAL"
      buttonText="UNSTAKE rLP"
      transactionButtonUnder
      transactionButtonClassName="w-full md:8/12"
      transactionButtonNoBorders
      labelBottomClassName="mt-4"
      labelBottom={confirmMessage}
      buttonTextLoading="Unstaking..."
      onOk={onUnstake} />
  </DeltaPanel>;
};

const RlpWithdrawal = () => {
  const modalContext = useContext(ModalContext);
  const globalHooks = useContext(GlobalHooksContext);

  const onUnstakDialog = async () => {
    await modalContext.showMessage('You are about to unstake your rLP', <RlpWithdrawalDialogContent />, false);
  };

  return <div className="my-6">
    <ul className="list-disc list-inside py-4 md:py-8">
      <li>Staked rLP: {formatting.getTokenAmount(globalHooks.staking.info.rlp, 18, 4)} rLP</li>
    </ul>
    <TransactionButton text="Unstake" textLoading="Unstaking..." onClick={onUnstakDialog} />
  </div>
};

const VaultWithdraw = ({ token }) => {
  const [tokenToWithdraw, setTokenToWithdraw] = useState('eth');

  const renderContent = (selectTokenToWithdraw) => {
    switch (selectTokenToWithdraw) {
      case 'eth':
        return <EthereumWithdrawal token={token} />
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
