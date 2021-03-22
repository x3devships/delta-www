import { useContext, useEffect, useState } from 'react';
import { useWallet } from 'use-wallet';
import BigNumber from 'bignumber.js';
import useYam from './useYam';
import { DATA_UNAVAILABLE } from '../config';
import { formatting, parsing, transactions } from '../helpers';
import { ModalContext } from '../contexts';

const VALUE_REFRESH_INTERVAL = 30 * 1000;
const SLIPPAGE_PER_MILE = 50; // 5% slippage

const MODE = {
  ETH_ONLY: "eth-only",
  BOTH_SIDES: "both-sides"
};

const useRlpRouter = () => {
  const yam = useYam();
  const wallet = useWallet();
  const modalContext = useContext(ModalContext);

  const [estimatedRlpAmount, setEstimatedRlpAmount] = useState(DATA_UNAVAILABLE);
  const [ethAmount, setEthAmount] = useState(DATA_UNAVAILABLE);
  const [gasEstimation, setGasEstimation] = useState(DATA_UNAVAILABLE);
  const [deltaAmount, setDeltaAmount] = useState(DATA_UNAVAILABLE);
  const [mode, setMode] = useState(DATA_UNAVAILABLE);
  const [autoStake, setAutoStake] = useState(false);

  const addSlippage = (minAmount, perMileSlippage) => {
    minAmount = new BigNumber(minAmount);
    perMileSlippage = new BigNumber(perMileSlippage);

    const slippageAmount = minAmount.multipliedBy(perMileSlippage).div(new BigNumber('1000'));
    return minAmount.minus(slippageAmount).toFixed(0);
  };

  const mint = async (estimationOnly) => {
    if (ethAmount === DATA_UNAVAILABLE) {
      return {
        gasEstimation: DATA_UNAVAILABLE,
        minLpAmount: DATA_UNAVAILABLE
      };
    }

    const ethValue = mode === MODE.BOTH_SIDES ? ethAmount * 2 : ethAmount;

    const ethValueBN = parsing.parseFloatToBigNumber(ethValue, 18);
    // Invalid amount, return rejection.
    if (!ethValueBN) {
      return Promise.reject();
    }

    let minLpAmount = new BigNumber(await yam.contracts.deltaRouter.methods.getLPTokenPerEthUnit(ethValueBN.toString()).call());
    console.log(`ethValueBN: ${ethValueBN.toString()} ${ethValueBN.toString() / 1e18}`);
    console.log(`minLpAmount: ${minLpAmount.toString()}, ${minLpAmount.toString() / 1e18}`);

    minLpAmount = addSlippage(minLpAmount, SLIPPAGE_PER_MILE);
    console.log(`minLpAmount with slippage: ${minLpAmount.toString()}, ${minLpAmount.toString() / 1e18}`);

    let transaction;

    if (mode === MODE.BOTH_SIDES) {
      const deltaValueBN = parsing.parseFloatToBigNumber(deltaAmount, 18);

      // Not a value delta amount, we cannot continue.
      if (!deltaValueBN) {
        return Promise.reject();
      }

      transaction = yam.contracts.deltaRouter.methods.addLiquidityBothSides(deltaValueBN.toString(), minLpAmount.toString(), autoStake);
    } else {
      transaction = yam.contracts.deltaRouter.methods.addLiquidityETHOnly(minLpAmount.toString(), autoStake);
    }

    const transactionParameters = {
      from: wallet.account,
      value: ethValueBN.toString()
    };

    if (estimationOnly) {
      const gasEstimation = new BigNumber(await transaction.estimateGas(transactionParameters));

      return {
        gasEstimation,
        minLpAmount,
      };
    }

    const confirmationMessage = autoStake ?
      `Are you sure you want to buy and automatically stake a minumum of ${formatting.getTokenAmount(minLpAmount, 18, 6)} rLP?` :
      `Are you sure you want to buy a minumum of ${formatting.getTokenAmount(minLpAmount, 18, 6)} rLP?`

    if (!await modalContext.showConfirm("Confirmation", confirmationMessage)) {
      return Promise.reject();
    }

    const successMessage = autoStake ?
      'Your rLP tokens have been bought and staked. You can see them displayed on the vault page' :
      'Your rLP tokens have been bought and they are now available in your wallet';

    const progressMessage = autoStake ?
      'Buying and staking your rLP tokens...' :
      'Buying your rLP tokens...';

    return transactions.executeTransaction(
      modalContext,
      transactions,
      transactionParameters,
      successMessage,
      "Success",
      "Error while buying rLP",
      "Transaction in progres...",
      progressMessage
    );
  };

  const update = async () => {
    if (!wallet) return;

    const { minLpAmount, gasEstimation } = await mint(true);

    setEstimatedRlpAmount(minLpAmount?.toString() / 1e18);
    setGasEstimation(gasEstimation);
  };

  const setEthAmountOnly = async ethAmount => {
    setMode(MODE.ETH_ONLY);
    setEthAmount(ethAmount);
    await update();
  };

  const setDeltaSide = async deltaAmount => {
    setMode(MODE.BOTH_SIDES);
    setDeltaAmount(deltaAmount);

    const deltaAmountBN = parsing.parseFloatToBigNumber(deltaAmount, 18);
    if (deltaAmountBN) {
      const ethAmount = await yam.contracts.deltaRouter.methods.getOptimalEthAmountForDeltaAmount(deltaAmountBN.toString()).call();
      setEthAmount(ethAmount.toString() / 1e18);
      await update();
    }
  };

  const setEthSide = async ethAmount => {
    setMode(MODE.BOTH_SIDES);
    setEthAmount(ethAmount);

    const ethAmountBN = parsing.parseFloatToBigNumber(ethAmount, 18);
    if (ethAmountBN) {
      const deltaAmount = await yam.contracts.deltaRouter.methods.getOptimalDeltaAmountForEthAmount(ethAmountBN.toString()).call();
      setDeltaAmount(deltaAmount.toString() / 1e18);
      await update();
    }
  };

  useEffect(() => {
    update();
  }, [deltaAmount, ethAmount, autoStake]);

  useEffect(() => {
    if (!yam?.contracts?.deltaRouter) {
      return false;
    }

    update();
    // const interval = setInterval(update, VALUE_REFRESH_INTERVAL);
    // return () => clearInterval(interval);
  }, [yam, wallet]);

  return {
    update,
    mint,
    setEthAmountOnly,
    setDeltaSide,
    setEthSide,
    setAutoStake,
    estimatedRlpAmount,
    gasEstimation,
    mode,
    ethAmount,
    deltaAmount
  };
};
export default useRlpRouter;
