import { useEffect, useState } from 'react';
import { useWallet } from 'use-wallet';
import useYam from './useYam';
import { hooks } from '../helpers';
import { addressMap, DATA_UNAVAILABLE } from '../config';

const REFRESH_RATE = 30 * 1000;

const useTokenBalance = (tokenName) => {
  const yam = useYam();
  const wallet = useWallet();
  const [balance, setBalance] = useState(DATA_UNAVAILABLE);
  const decimals = addressMap[tokenName]?.decimals || 18;

  const update = async () => {
    if (tokenName?.toUpperCase() === 'ETH') {
      const balance = (await yam.web3.eth.getBalance(wallet.account)).toString() / 10 ** decimals
      setBalance(balance);
      return;
    }

    if (!(tokenName in yam.contracts)) {
      return;
    }

    const balance = (await yam.contracts[tokenName].methods.balanceOf(wallet.account).call()) / 10 ** decimals;
    setBalance(balance);
  }

  useEffect(() => {
    let interval;

    if (yam) {
      interval = hooks.setWalletAwareInterval(wallet, update, REFRESH_RATE);
    }

    return () => clearInterval(interval);
  }, [yam, wallet]);

  return {
    update,
    balance
  };
};

export default useTokenBalance;
