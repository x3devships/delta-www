/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
import { useContext, useState, useEffect } from 'react';
import { useWallet } from 'use-wallet';
import { ModalContext } from '../../contexts';
import { GlobalHooksContext } from '../../contexts/GlobalHooks';
import { formatting, transactions } from '../../helpers';
import DeltaButton from '../Button/DeltaButton';
import TransactionButton from '../Button/TransactionButton';
import { CompoundBurnCheckbox } from '../CheckBox';
import { DeltaPanel } from '../Section'
import { DATA_UNAVAILABLE, deltaSushiswapUrl, oneInchUrlRlp } from '../../config';
import { useRlpRouter, useYam } from '../../hooks';
import { TokenInput } from '../Input';
import { DeltaTitleH4 } from '../Title';
import { Tips } from '../Tooltip';

const DeltaAndRlpDeposit = ({ depositAction }) => {
  switch (depositAction) {
    case true: case false: case 0:
      return <DeltaDeposit />;
    case 1:
      return <DeltaBuy />;
    case 2:
      return <RlpDeposit />;
    /* case 3:
      return <RlpMinting />; */
    case 3:
      return <RlpBuy />;
    default:
      return null;
  }
}

const RlpDeposit = () => {
  const globalHooks = useContext(GlobalHooksContext);
  const modalContext = useContext(ModalContext);
  const yam = useYam();
  const wallet = useWallet();

  // eslint-disable-next-line consistent-return
  const onStake = async (amount, amountBN) => {
    // const booster = globalHooks.staking.info.booster;
    const title = `Staking`; // , you will get ${claimEth} ETH, ${claimDelta} DELTA, ${rlp} rLP in your wallet`;
    const message = `Are you sure you wanna stake ${amount} rLP ?`;
    const breakdown = [
      ['RLP TO STAKE', amount, 'rLP'],
    ];
    const confirmed = await modalContext.showConfirmWithBreakdown(title, message, breakdown);
    // const confirmed = await modalContext.showConfirm('Staking', `Are you sure you wanna stake ${amount} rLP ?`);

    if (!confirmed) {
      return false;
    }
    const transaction = yam.contracts.dfv.methods.deposit(amountBN.toString(), 0);

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

    return true;
  };

  const allowanceRequiredFor = {
    contract: 'dfv',
    token: 'rLP'
  };

  return <div className="mt-4">
    <DeltaTitleH4>Stake rLP From Your Wallet</DeltaTitleH4>
    <TokenInput className="mt-0" token="rLP" buttonText="Stake" buttonTextLoading="Staking..." onOk={onStake} allowanceRequiredFor={allowanceRequiredFor} />
  </div>
};

const DeltaDeposit = () => {
  const globalHooks = useContext(GlobalHooksContext);
  const modalContext = useContext(ModalContext);
  const yam = useYam();
  const wallet = useWallet();

  // eslint-disable-next-line consistent-return
  const onStake = async (amount, amountBN, valid, burning) => {
    if (!valid) {
      await modalContext.showError('Error', 'Invalid input');
    } else {

      // const message = burning ?
      //  `You are about to stake ${amount} DELTA in the Deep Farming Vault. ${(amount / 2).toLocaleString()} DELTA will be locked permanently in the DFV.` :
      //  `You are about to stake ${amount} DELTA in the Deep Farming Vault without a "Burn Deposit". This will reduce your Multiplier from ${globalHooks.staking.info.booster}x to 1x. To prevent this please check the box Burn Deposit.`;
      // const confirmed = await modalContext.showConfirm('Staking', message);

      // const claimDelta = formatting.getTokenAmount(farmedDelta, 18, 4);
      // const claimEth = formatting.getTokenAmountAsStrWithMinPrecision(farmedETH, 18, 4);
      // const _rlp = formatting.getTokenAmount(rlp, 18, 4);
      const { booster } = globalHooks.staking.info;
      const title = `Staking`; // , you will get ${claimEth} ETH, ${claimDelta} DELTA, ${rlp} rLP in your wallet`;
      const amountLock = (amount / 2).toLocaleString();
      const message = burning ?
        `You are about to stake ${amount} DELTA in the Deep Farming Vault. ${amountLock} DELTA will be locked permanently in the Deep Farming Vault.` :
        `You are about to stake ${amount} DELTA in the Deep Farming Vault without a "Burn Deposit". This will reduce your Multiplier from ${booster}x to 1x. To prevent this please check the box Burn Deposit.`;
      const breakdown = [
        ['DELTA TO DEPOSIT', amount, 'DELTA'],
        // [ 'BURN/LOCKED IN VAULT', amountLock, 'DELTA' ],
      ];
      if (burning) {
        breakdown.push(['DEPOSIT BURN (50%)', amountLock, 'DELTA']);
      } else {
        breakdown.push((i) =>
          <div key={i} className="receipt__list-row">
            <dt className="receipt__item"><del>DEPOSIT BURN</del> (0%)</dt>
            <dd className="receipt__cost">0 DELTA</dd>
          </div>);
        // [ 'DEPOSIT BURN (0%)', 0, 'DELTA' ] );
      }
      const confirmed = await modalContext.showConfirmWithBreakdown(title, message, breakdown);
      if (!confirmed) {
        return Promise.resolve();
      }

      if (confirmed) {
        const transaction = burning ?
          yam.contracts.dfv.methods.depositWithBurn(amountBN.toString()) :
          yam.contracts.dfv.methods.deposit(0, amountBN.toString());

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

        return true;
      }
    }
  };

  const getCompoundDepositConfirmationMessage = async (account, compoundBurn, farmedDelta) => {
    // Gas estimate to anticipate futur revert messages
    const transaction = yam.contracts.dfv.methods.compound(account);
    const potentialRevertMessage = await transactions.getRevertMessageFromTransaction(transaction, { from: wallet.account });

    if (potentialRevertMessage !== false) {
      return potentialRevertMessage;
    }

    if (!compoundBurn) {
      return `You are about to stake ${farmedDelta} DELTA in the Deep Farming Vault`;
    }

    return `You are about to stake ${farmedDelta} DELTA in the Deep Farming Vault with compound burning enabled. This is will burn 50% of it to increase your booster.`;
  };

  // eslint-disable-next-line consistent-return
  const onCompoundDeposit = async () => {
    const userInfo = await yam.contracts.dfv.methods.userInfo(wallet.account).call();
    const { compoundBurn } = userInfo;

    const farmedDelta = formatting.getTokenAmount(globalHooks.staking.info.farmedDelta, 18, 4);
    const message = await getCompoundDepositConfirmationMessage(wallet.account, compoundBurn, farmedDelta);
    const confirmed = await modalContext.showConfirm('Compound Staking', message);

    if (confirmed) {
      const transaction = yam.contracts.dfv.methods.compound(wallet.account);

      await transactions.executeTransaction(
        modalContext,
        transaction,
        { from: wallet.account },
        "Successfully compounded",
        "Compound",
        "Error while compounding"
      );

      globalHooks.staking.update();
      globalHooks.delta.update();

      return true;
    }
  };

  const allowanceRequiredFor = {
    contract: 'dfv',
    token: 'delta'
  };

  const renderCompoundBurn = () => {
    const { hasFarmedDelta } = globalHooks.staking.info;
    return <div className="mt-6">
      <DeltaTitleH4>Compound Your Staking Rewards</DeltaTitleH4>
      <CompoundBurnCheckbox className="flex mt-2 md:ml-1 d-none" />
      <div className="mt-4">
        <DeltaButton className="flex md:block mt-4 md:w-max"
          disabled={!hasFarmedDelta}
          onClick={() => onCompoundDeposit()}>
          {!hasFarmedDelta ? 'Nothing To Compound' : 'Compound Deposit'}
        </DeltaButton>
      </div>
      <div className="flex" style={{ justifyContent: 'space-between' }}>
        <div className="text-sm text-gray-400 flex mt-1">
          Compound your stake by depositing your current rewards
        </div>
      </div>
    </div>
  };

  return <div>
    <div className="mt-4">
      <DeltaTitleH4>Stake DELTA From Your Wallet</DeltaTitleH4>
      <TokenInput className="mt-0"
        token="delta-all"
        buttonText="Stake"
        labelBottomClassName="text-xs text-gray-400"
        labelBottom="Deposit DELTA and earn yield"
        buttonTextLoading="Staking..."
        checkboxButton="Burn Deposit"
        checkboxButtonTip={Tips.burnStakeDeposit}
        checkboxButtonChecked
        onOk={onStake}
        allowanceRequiredFor={allowanceRequiredFor} />
    </div>
    {renderCompoundBurn()}
  </div>;
};

const DeltaBuy = () =>
  <div>
    <div className="mt-4">
      <DeltaTitleH4>Buy DELTA on 1Inch</DeltaTitleH4>
      <a className="flex-1 md:flex-grow-0" target="_blank" href={deltaSushiswapUrl} rel="noopener noreferrer">
        <DeltaButton grayLook={!1}>Open exchange</DeltaButton>
      </a>
    </div>
  </div>;

const RlpBuy = () =>
  <div>
    <div className="mt-4">
      <DeltaTitleH4>Buy rLP</DeltaTitleH4>
      <div className="text-sm my-4 p-2 bg-red-100 border-l-4 border-green-600">Minting rLP tokens has been disabled as minting price is currently too high instead you can buy rLP on exchanges.</div>
      <a className="flex-1 md:flex-grow-0" target="_blank" href={oneInchUrlRlp} rel="noopener noreferrer">
        <DeltaButton grayLook={!1}>Open exchange</DeltaButton>
      </a>
    </div>
  </div>;

const RlpMinting = () => {
  const router = useRlpRouter();
  const [estimationLabel, setEstimationLabel] = useState('');
  const globalHooks = useContext(GlobalHooksContext);

  useEffect(() => {
    const text = `estimated rLP minted: ${formatting.getTokenAmount(router.estimatedRlpAmount, 0, 4)} ` +
      `rLP ➔ Gas cost: ${formatting.getTokenAmount(router.gasEstimation, 18, 4)} ETH `;
    setEstimationLabel(text);
  }, [router.estimatedRlpAmount, router.gasEstimation]);

  const onBuy = async (amount, amountBN, valid, autoStake) => {
    if (amount !== DATA_UNAVAILABLE) {
      router.setAutoStake(autoStake);
      return router.mint(amount, autoStake, false);
    }
    return true;
  };

  const onChange = async (amount, amountBN, valid, autoStake) => {
    router.setAutoStake(autoStake);

    if (amount !== DATA_UNAVAILABLE) {
      await router.setEthAmountOnly(amount);
    }
  };

  return (
    <div>
      <div className="mt-4">
        <DeltaTitleH4>Mint rLP tokens by depositing ETH</DeltaTitleH4>
        <div className="text-sm my-4 p-2 bg-green-100 border-l-4 border-green-600">Note: Creating new RLP supply can sometimes cost more than buying on a second hand market</div>
        <ul className="list-disc list-inside py-2">
          <li>Deposit Ethereum to mint new rLP tokens</li>
          <li>Select stake automatically to immediately stake the new rLP in the Deep Farming Vault</li>
          <li>1 LP = {formatting.getTokenAmount(globalHooks.staking.rlpPerLp)} rLP</li>
        </ul>
        <TokenInput
          className="mt-4"
          token="ETH"
          buttonText="MINT"
          onChange={onChange}
          labelBottom={estimationLabel}
          buttonTextLoading="MINTING..."
          checkboxButton="Stake"
          checkboxButtonChecked={false}
          onOk={onBuy} />
      </div>
    </div>);
};

const VaultDeposit = ({ token }) => {
  const [depositAction, setDepositAction] = useState(true);

  if (!token) {
    return <div>
      <DeltaPanel className="flex items-center text-center flex-wrap">
        <div className="flex border border-black p-1 flex-grow md:flex-none">
          <DeltaButton className="flex-1 mr-2 md:flex-grow-0"
                       onClick={() => setDepositAction(() => 0)}
                       grayLook={!depositAction || typeof depositAction === 'boolean'}>
            Stake Delta
          </DeltaButton>

          <DeltaButton className="flex-1 mr-2 md:flex-grow-0"
                       onClick={() => setDepositAction(() => 1)}
                       grayLook={depositAction === 1}>
            Buy DELTA
          </DeltaButton>

          <DeltaButton className="flex-1 mr-2 md:flex-grow-0"
                       onClick={() => setDepositAction(() => 2)}
                       grayLook={depositAction === 2}>
            Stake rLP
          </DeltaButton>

          {/* <DeltaButton className="flex-1 md:flex-grow-0"
                       onClick={() => setDepositAction(() => 3)}
                       grayLook={depositAction === 3}>
            MINT rLP
          </DeltaButton> */}

          <DeltaButton className="flex-1 md:flex-grow-0"
                       onClick={() => setDepositAction(() => 3)}
                       grayLook={depositAction === 3}>
            Buy rLP
          </DeltaButton>
        </div>
      </DeltaPanel>
      <DeltaAndRlpDeposit {...{ depositAction }} />
    </div>;
  }

  // eslint-disable-next-line consistent-return
  const renderContent = () => {
    switch (token) {
      case "rLP":
        if (depositAction) {
          return <RlpDeposit />
        }
        return <RlpMinting />;
      case "delta":
        if (depositAction) {
          return <DeltaDeposit />;
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
        grayLook={depositAction}>MINT rLP</DeltaButton>
    }

    return <a className="flex-1 md:flex-grow-0" target="_blank" href={deltaSushiswapUrl} rel="noopener noreferrer">
      <DeltaButton grayLook={depositAction}>BUY DELTA</DeltaButton>
    </a>;
  }

  return <div>
    <DeltaPanel className="flex items-center text-center flex-wrap">
      <div className="flex border border-black p-1 flex-grow md:flex-none">
        <DeltaButton className="flex-1 mr-2 md:flex-grow-0"
          onClick={() => setDepositAction(t => !t)}
          grayLook={!depositAction}>
          {token === 'rLP' ? 'Stake rLP' : 'Stake DELTA'}
        </DeltaButton>
        {renderBuyButton(token)}
      </div>
    </DeltaPanel>
    {renderContent()}
  </div>;
};

/* const CreateWithdrawalContractContent = ({ token }) => {
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
*/

const DeltaWithdrawal = () => {
  const globalHooks = useContext(GlobalHooksContext);
  const modalContext = useContext(ModalContext);
  // const router = useRouter();
  const yam = useYam();
  const wallet = useWallet();

  // Note all rewards are claimed...
  const onClaimDelta = async () => {
    const {
      farmedDelta,
      farmedETH,
    } = globalHooks.staking.info;

    const claimDelta = formatting.getTokenAmount(farmedDelta, 18, 4);
    const claimEth = formatting.getTokenAmountAsStrWithMinPrecision(farmedETH, 18, 4);

    const title = `You are about to claim your DELTA (and ETH rewards)`; // , you will get ${claimEth} ETH, ${claimDelta} DELTA, ${rlp} rLP in your wallet`;
    const message = `NOTE: To save you some gas fees your ETH rewards will also be claimed in the same operation.`;
    const breakdown = [
      ['CLAIM ETHEREUM REWARDS', claimEth, 'WETH'],
      ['CLAIM DELTA REWARDS', claimDelta, 'DELTA'],
    ];
    const confirm = await modalContext.showConfirmWithBreakdown(title, message, breakdown);

    if (!confirm) {
      return Promise.resolve();
    }

    if (globalHooks.staking.info.compoundBurn === DATA_UNAVAILABLE) {
      console.error('Cannot claim - stopped, data unavailable.');
      return false;
    }

    let transaction = yam.contracts.dfv.methods.deposit(0, 0);
    if (globalHooks.staking.info.compoundBurn) {
      transaction = yam.contracts.dfv.methods.depositWithBurn(0);
    }

    await transactions.executeTransaction(
      modalContext,
      transaction,
      { from: wallet.account },
      "Successfully claimed rewards",
      "Claim",
      "Error while claiming"
    );

    globalHooks.staking.update();
    globalHooks.delta.update();

    return Promise.resolve();
  };

  const executeUnstakeAndClaimAll = async () => {
    const transaction = yam.contracts.dfv.methods.exit();

    await transactions.executeTransaction(
      modalContext,
      transaction,
      { from: wallet.account },
      "Successfully Unstaked and claimed",
      "Unstaking & Claimed ALL",
      "Error while Unstaking & Claiming ALL"
    );

    globalHooks.staking.update();
    globalHooks.delta.update();
  };

  const onUnstakeAndClaimAll = async () => {
    const {
      farmedDelta,
      farmedETH,
      rlp,
      ableToWithdrawDelta,
    } = globalHooks.staking.info;

    const claimDelta = formatting.getTokenAmount(farmedDelta, 18, 4);
    const claimEth = formatting.getTokenAmount(farmedETH, 18, 4);
    const rlpF = formatting.getTokenAmount(rlp, 18, 4);
    const stakedDelta = formatting.getTokenAmount(ableToWithdrawDelta, 18, 4);

    const title = `You are about to claim all rewards and unstake all staked DELTA and rLP`; // , you will get ${claimEth} ETH, ${claimDelta} DELTA, ${rlp} rLP in your wallet`;
    const message = `NOTE: This action will automatically withdraw your Ethereum and DELTA rewards in addition to unstake your staked DELTA and rLP. Also, pay attention that withdrawing DELTA rewards will initiate the one year vesting period.`;
    const breakdown = [
      ['CLAIM ETHEREUM REWARDS', claimEth, 'WETH'],
      ['CLAIM DELTA REWARDS', claimDelta, 'DELTA'],
      ['UNSTAKE STAKED rLP', rlpF, 'rLP'],
      ['UNSTAKE STAKED DELTA', stakedDelta, 'DELTA']
    ];
    const confirm = await modalContext.showConfirmWithBreakdown(title, message, breakdown);

    if (confirm) {
      await executeUnstakeAndClaimAll();
    }
  };

  const {
    ableToWithdrawDelta,
    farmedDelta,
    hasFarmedDelta,
  } = globalHooks.staking.info;
  return <div className="my-4">
    <>
      <DeltaTitleH4>Withdraw DELTA from the Vault</DeltaTitleH4>
      <ul className="list-disc list-inside py-2">
        <li>Staked DELTA: {formatting.getTokenAmount(ableToWithdrawDelta.minus(farmedDelta), 18, 4)} DELTA</li>
      </ul>
      <div className="flex flex-grow md:flex-none">
        <TransactionButton className="flex-1"
          text="Unstake & Claim ALL"
          onClick={() => onUnstakeAndClaimAll()} />
      </div>
    </>
    <DeltaTitleH4 className="mt-4">Claim DELTA rewards from the Vault</DeltaTitleH4>
    <ul className="list-disc list-inside py-2">
      <li>Ready to Compound DELTA: {formatting.getTokenAmount(farmedDelta, 18, 4)} DELTA</li>
    </ul>
    <div className="flex flex-grow md:flex-none">
      <TransactionButton className="flex-1 mr-2 md:flex-grow-0"
        style={{ minWidth: '150px' }}
        disabled={!hasFarmedDelta}
        text={hasFarmedDelta ? 'Claim rewards' : 'Nothing to claim'} onClick={onClaimDelta} />
    </div>
  </div>
};

const EthereumWithdrawal = () => {
  const globalHooks = useContext(GlobalHooksContext);
  const yam = useYam();
  const wallet = useWallet();
  const modalContext = useContext(ModalContext);

  const onClaimEth = async () => {
    if (globalHooks.staking.info.compoundBurn === DATA_UNAVAILABLE) {
      return Promise.reject();
    }

    const {
      farmedDelta,
      farmedETH,
    } = globalHooks.staking.info;

    const claimDelta = formatting.getTokenAmount(farmedDelta, 18, 4);
    // const claimEth = formatting.getTokenAmount(farmedETH, 18, 4);
    const claimEth = formatting.getTokenAmountAsStrWithMinPrecision(farmedETH, 18, 4);
    const title = `You are about to claim your ETH (and DELTA rewards)`; // , you will get ${claimEth} ETH, ${claimDelta} DELTA, ${rlp} rLP in your wallet`;
    const message = `NOTE: To saving you some gas fees DELTA rewards are also claimed in the same operation. `;
    const breakdown = [
      ['CLAIM ETHEREUM REWARDS', claimEth, 'WETH'],
      ['CLAIM DELTA REWARDS', claimDelta, 'DELTA'],
    ];
    const confirm = await modalContext.showConfirmWithBreakdown(title, message, breakdown);

    if (confirm) {
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
    return Promise.resolve();
  }

  const {
    hasFarmedETH,
    farmedETH
  } = globalHooks.staking.info;

  // const amountWethRewards = formatting.getTokenAmount(farmedETH, 18, 4);
  const amountWethRewards = formatting.getTokenAmountAsStrWithMinPrecision(farmedETH, 18, 4);
  return <div className="my-4">
    <DeltaTitleH4>Withdraw Ethereum Rewards from the Vault</DeltaTitleH4>
    <ul className="list-disc list-inside py-2">
      <li>Claimable Ethereum: {amountWethRewards} WETH</li>
    </ul>
    <TransactionButton disabled={!hasFarmedETH}
      style={{ minWidth: '150px' }}
      text={hasFarmedETH ? 'Claim WETH' : 'Nothing to claim'}
      textLoading="Claiming..."
      onClick={onClaimEth} />
  </div>
};

const RlpWithdrawal = () => {
  const modalContext = useContext(ModalContext);
  const globalHooks = useContext(GlobalHooksContext);
  const yam = useYam();
  const wallet = useWallet();

  const onUnstakerLPDialog = async () => {

    // ND: old message:
    // const content = `This will withdraw ${formatting.getTokenAmount(globalHooks.staking.info.rlp, 18, 4)} rLP. And automatically claim your WETH and compound DELTA. You will get ${formatting.getTokenAmount(globalHooks.staking.info.rlp, 18, 4)} rLP in your wallet`;
    // const confirm = await modalContext.showConfirm('You are about to unstake your rLP', content);

    // ND: New message:
    const {
      rlp,
      // farmedDelta,
      farmedETH,
    } = globalHooks.staking.info;

    // const claimDelta = formatting.getTokenAmount(farmedDelta, 18, 4);
    const claimEth = formatting.getTokenAmountAsStrWithMinPrecision(farmedETH, 18, 4);
    const _rlp = formatting.getTokenAmount(rlp, 18, 4);

    const title = `You are about to unstake your rLP`;
    const message = `NOTE: Besides unstaking rLP this operation will also automatically claim your WETH rewards and compound DELTA. Please consider if you want to enable compound burn on the compounded DELTA rewards. We do this to save you additional gas fees.`;
    const breakdown = [
      [ 'RLP TRANSFERED TO YOUR WALLET', _rlp, 'RLP' ],
      [ 'CLAIM ETHEREUM REWARDS', claimEth, 'WETH' ]
      // [ 'CLAIM DELTA REWARDS', claimDelta, 'DELTA' ],
    ];
    const confirm = await modalContext.showConfirmWithBreakdown(title, message, breakdown);

    if (!confirm) {
      return;
    }
    const transaction = yam.contracts.dfv.methods.withdrawRLP(globalHooks.staking.info.rlp.toString());

    await transactions.executeTransaction(
      modalContext,
      transaction,
      { from: wallet.account },
      "Successfully unstaked rLP",
      "Unstake",
      "Error while unstaking rLP"
    );

    globalHooks.staking.update();
    globalHooks.rlpInfo.update();
  };

  const {
    hasStakedRlp
  } = globalHooks.staking.info;
  return <div className="my-4">
    <DeltaTitleH4>Withdraw Staked rLP from the Vault</DeltaTitleH4>
    <ul className="list-disc list-inside py-2">
      <li>Staked rLP: {formatting.getTokenAmount(globalHooks.staking.info.rlp, 18, 4)} rLP</li>
    </ul>
    <TransactionButton style={{ minWidth: '150px' }}
      disabled={!hasStakedRlp}
      text={hasStakedRlp ? 'Unstake rLP' : 'Nothing to unstake'}
      textLoading="Unstaking..."
      onClick={() => onUnstakerLPDialog()} />
  </div>
};

const VaultWithdraw = ({ token }) => {
  const [tokenToWithdraw, setTokenToWithdraw] = useState('delta');

  const renderContent = (selectTokenToWithdraw) => {
    switch (selectTokenToWithdraw) {
      case 'eth':
        return <EthereumWithdrawal />
      case 'delta':
        return <DeltaWithdrawal token={token || 'delta'} />
      case 'rlp':
        return <RlpWithdrawal />
      default:
        return <>

        </>;
    }
  };

  const renderButtons = () => {
    if (token === 'delta') {
      return <>
        <DeltaButton className="flex-1 mr-2 md:flex-grow-0"
          onClick={() => setTokenToWithdraw('eth')}
          grayLook={tokenToWithdraw !== 'eth'}>
          Ethereum
        </DeltaButton>
        <DeltaButton className="flex-1 md:flex-grow-0"
          onClick={() => setTokenToWithdraw('delta')}
          grayLook={tokenToWithdraw !== 'delta'}>
          DELTA
        </DeltaButton>
      </>;
    }

    return <>
      <DeltaButton className="flex-1 mr-2 md:flex-grow-0" onClick={() => setTokenToWithdraw('delta')} grayLook={tokenToWithdraw !== 'delta'}>DELTA</DeltaButton>
      <DeltaButton className="flex-1 mr-2 md:flex-grow-0" onClick={() => setTokenToWithdraw('eth')} grayLook={tokenToWithdraw !== 'eth'}>Ethereum</DeltaButton>
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

const VaultStaking = ({ token, className = '', dashedBorder }) => {
  const [depositAction, setDepositAction] = useState(true);
  const borderClass = dashedBorder ? 'border-t-2 border-dashed border-black' : '';
  return (
    <DeltaPanel className={`pt-2 mt-4 ${borderClass} ${className}`}>
      <div className="flex uppercase" onClick={() => setDepositAction(t => !t)}>
        <div className="flex self-end select-none cursor-pointer text-sm mb-2">
          <div className={`${!depositAction ? 'text-gray-300' : 'text-black'}`}>{!depositAction ? <>Deposit</> : <u>Deposit</u>}</div>
          <div className="px-1">/</div>
          <div className={`${depositAction ? 'text-gray-300' : 'text-black'}`}>{depositAction ? <>Withdraw</> : <u>Withdraw</u>}</div>
        </div>
      </div>
      <div className="mt-4 md:mt-1">
        {depositAction ? <VaultDeposit token={token} /> : <VaultWithdraw token={token} />}
      </div>
    </DeltaPanel>);
};

export default VaultStaking;
