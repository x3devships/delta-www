import { useEffect, useState } from 'react';
import { useWallet } from 'use-wallet';
import BigNumber from 'bignumber.js';
import useYam from './useYam';
import { hooks } from '../helpers';
import { addressMap, DATA_UNAVAILABLE, tokenMap } from '../config';

const REFRESH_RATE = 30 * 1000;

const useTokenBalance = (tokenName) => {
  const yam = useYam();
  const wallet = useWallet();
  const [balance, setBalance] = useState(DATA_UNAVAILABLE);
  const [balanceBN, setBalanceBN] = useState(DATA_UNAVAILABLE);
  const tokenAddress = addressMap[tokenName];
  const decimals = tokenMap[tokenAddress]?.decimals || 18;

  const update = async () => {
    if (!yam || !wallet?.account) return;

    if (tokenName?.toUpperCase() === 'ETH') {
      const balance = (await yam.web3.eth.getBalance(wallet.account)).toString() / 10 ** decimals;
      setBalance(balance);
      return;
    }

    if (!(tokenName in yam.contracts)) {
      return;
    }

    const balanceBN = new BigNumber(await yam.contracts[tokenName].methods.balanceOf(wallet.account).call());
    const balance = balanceBN.toString() / 10 ** decimals;
    setBalance(balance);
    setBalanceBN(balanceBN);
  }

  useEffect(() => {
    let interval;

    if (yam) {
      update();
      interval = hooks.setWalletAwareInterval(wallet, update, REFRESH_RATE);
    }

    return () => clearInterval(interval);
  }, [yam, wallet]);

  return {
    update,
    balance,
    balanceBN
  };
};

export default useTokenBalance;
