/* eslint-disable no-await-in-loop */
import { useEffect, useState } from 'react';
import { useWallet } from 'use-wallet';
import moment from 'moment';
import { DATA_UNAVAILABLE } from '../config';
import { hooks } from '../helpers';
import useYam from './useYam';

const REFRESH_RATE = 15 * 60 * 1000;
const NUM_EPOCH = 14;

const useDelta = () => {
  const yam = useYam();
  const wallet = useWallet();
  const [data, setData] = useState({
    balance: DATA_UNAVAILABLE,
    total: DATA_UNAVAILABLE,
    mature: DATA_UNAVAILABLE,
    immature: DATA_UNAVAILABLE,
    fullyVestedAt: DATA_UNAVAILABLE,
    vestingInProgress: false,
    vestingTransactions: []
  });

  const update = async () => {
    if (!yam || !wallet?.account) return;

    const totalsForWallet = await yam.contracts.delta.methods.totalsForWallet(wallet.account).call();
    const total = totalsForWallet.total.toString() / 1e18;
    const mature = totalsForWallet.mature.toString() / 1e18;
    const immature = totalsForWallet.immature.toString() / 1e18;
    const vestingTransactions = [];
    let fullyVestedAt = 0;

    for (let i = 0; i < NUM_EPOCH; i++) {
      const vestingTransaction = await yam.contracts.delta.methods.vestingTransactions(wallet.account, i).call();
      const vestingTransactionDetails = await yam.contracts.delta.methods.getTransactionDetail(vestingTransaction).call();

      if (vestingTransactionDetails.fullVestingTimestamp > fullyVestedAt) {
        fullyVestedAt = vestingTransactionDetails.fullVestingTimestamp;
      }

      vestingTransactions.push({
        amount: vestingTransactionDetails.amount / 1e18,
        fullVestingTimestamp: vestingTransactionDetails.fullVestingTimestamp * 1000,
        immature: vestingTransactionDetails.immature / 1e18,
        mature: vestingTransactionDetails.mature / 1e18,
        percentVested: vestingTransactionDetails.percentVestedE4 / 1e4,
      })
    }

    setData(data => ({
      ...data,
      total,
      mature,
      immature,
      fullyVestedAt: fullyVestedAt * 1000,
      vestingInProgress: fullyVestedAt * 1000 > moment.now(),
      vestingTransactions
    }))
  };

  useEffect(() => {
    update();
    const interval = hooks.setWalletAwareInterval(wallet, update, REFRESH_RATE);

    return () => clearInterval(interval);
  }, [yam]);

  return {
    update,
    data
  };
};

export default useDelta;
