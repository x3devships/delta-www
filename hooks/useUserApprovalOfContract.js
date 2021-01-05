import BigNumber from 'bignumber.js';
import { useEffect, useMemo, useState } from 'react';
import { useWallet } from 'use-wallet';
import { DATA_UNAVAILABLE } from '../config';
import { hooks } from '../helpers';
import useYam from './useYam';

const REFRESH_RATE = 10 * 1000;

const useUserApprovalOfContract = (contract, token) => {
  const yam = useYam();
  const wallet = useWallet();
  const [amount, setAmount] = useState(DATA_UNAVAILABLE);

  async function refresh() {
    if (!contract || !token) return;

    const amount = new BigNumber(
      await yam.contracts[token].methods.allowance(wallet.account, yam.contracts[contract]._address).call()
    );
    setAmount(amount);
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
      amount,
      refresh
    }),
    [amount]
  );
};

export default useUserApprovalOfContract;
