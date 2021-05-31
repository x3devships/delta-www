/* eslint-disable no-await-in-loop */
import { useEffect, useState } from 'react';
import { useWallet } from 'use-wallet';
import { DATA_UNAVAILABLE } from '../config';
import { hooks } from '../helpers';
import useYam from './useYam';

const REFRESH_RATE = 1 * 60 * 1000;
const NUM_EPOCH = 7;

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
    percentVested: DATA_UNAVAILABLE,
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
        fullVestingTimestamp: vestingTransactionDetails.fullVestingTimestamp,
        immature: vestingTransactionDetails.immature / 1e18,
        mature: vestingTransactionDetails.mature / 1e18,
        percentVested: (vestingTransactionDetails.mature / 1e18) / (vestingTransactionDetails.amount / 1e18)
      });
    }

    const block = await yam.web3.eth.getBlock("latest");

    setData(data => ({
      ...data,
      total,
      mature,
      immature,
      percentVested: total > 0 ? mature / total : NaN,
      fullyVestedAt,
      vestingInProgress: fullyVestedAt > block.timestamp,
      vestingTransactions
    }))
  };


  useEffect(() => {
    if (!yam?.contracts?.delta) {
      return false;
    }

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
