import { useEffect, useMemo, useState } from 'react';
import BigNumber from 'bignumber.js';
import { useWallet } from 'use-wallet';
import useYam from './useYam';
import { hooks } from '../helpers';
import { DATA_UNAVAILABLE } from '../config';

const REFRESH_RATE = 30 * 1000;

const useUserTokenBalance = tokenName => {
  const yam = useYam();
  const wallet = useWallet();

  const [data, setData] = useState({
    balance: DATA_UNAVAILABLE
  });

  async function refresh() {
    if (tokenName === 'eth') {
      return;
    }

    if (!(tokenName in yam.contracts)) {
      return;
    }

    const balance = new BigNumber(await yam.contracts[tokenName].methods.balanceOf(wallet.account).call());
    setData(data => ({
      ...data,
      balance
    }));
  }

  useEffect(() => {
    let interval;

    if (yam) {
      interval = hooks.setWalletAwareInterval(wallet, refresh, REFRESH_RATE);
    }

    return () => clearInterval(interval);
  }, [yam, wallet]);

  return useMemo(
    () => ({
      data,
      refresh
    }),
    [data.balance]
  );
};

export default useUserTokenBalance;
