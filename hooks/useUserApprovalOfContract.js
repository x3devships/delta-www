import BigNumber from 'bignumber.js';
import { useEffect, useMemo, useState } from 'react';
import { useWallet } from 'use-wallet';
import { DATA_UNAVAILABLE } from '../config';
import { hooks } from '../helpers';
import useYam from './useYam';

const REFRESH_RATE = 30 * 1000;

const useUserApprovalOfContract = (contract, token) => {
  const yam = useYam();
  const wallet = useWallet();
  const [amount, setAmount] = useState(DATA_UNAVAILABLE);

  const update = async () => {
    if (!yam || !wallet?.account) return;
    if (!contract || !token) return;

    const amount = new BigNumber(
      await yam.contracts[token].methods.allowance(wallet.account, yam.contracts[contract]._address).call()
    );
    setAmount(amount);
  };

  useEffect(() => {
    let interval;
    if (yam) {
      update();
      interval = hooks.setWalletAwareInterval(wallet, update, REFRESH_RATE);
    }
    return () => clearInterval(interval);
  }, [yam, wallet]);

  return useMemo(
    () => ({
      amount,
      update
    }),
    [amount]
  );
};

export default useUserApprovalOfContract;
