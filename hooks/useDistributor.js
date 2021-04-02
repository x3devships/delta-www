import { useEffect, useState } from 'react';
import { useWallet } from 'use-wallet';
import BigNumber from 'bignumber.js';
import useYam from './useYam';
import { DATA_UNAVAILABLE, addressMap } from '../config';

const REFRESH_RATE = 60 * 1000;

const useDistributor = () => {
  const yam = useYam();
  const wallet = useWallet();

  const [info, setInfo] = useState({
    isLiquidator: DATA_UNAVAILABLE,
    pendingCredits: DATA_UNAVAILABLE,
    hasDeltaToDistribute: false,
    hasDeltaToBurn: false
  });

  const update = async () => {
    if (!yam || !wallet?.account) return;

    const isLiquidator = await yam.contracts.distributor.methods.isApprovedLiquidator(wallet.account).call();
    const pendingCredits = new BigNumber(await yam.contracts.distributor.methods.pendingCredits(wallet.account).call());
    const pendingBurn = new BigNumber(await yam.contracts.distributor.methods.pendingBurn().call());
    const pendingDev = new BigNumber(await yam.contracts.distributor.methods.pendingDev().call());
    const pendingTotal = new BigNumber(await yam.contracts.distributor.methods.pendingTotal().call());
    const balance = new BigNumber(await yam.contracts.delta.methods.balanceOf(addressMap.distributor).call());
    const pendingToDistribute = balance.minus(pendingTotal);
    const hasDeltaToDistribute = pendingToDistribute.gt(0);
    const hasDeltaToBurn = pendingBurn.gt(0);

    setInfo({
      hasDeltaToBurn,
      hasDeltaToDistribute,
      isLiquidator,
      pendingToDistribute,
      pendingCredits,
      pendingBurn,
      pendingDev,
      pendingTotal,
    });
  };

  useEffect(() => {
    update();
    const interval = setInterval(update, REFRESH_RATE);
    return () => clearInterval(interval);
  }, [yam, wallet]);

  return {
    update,
    info,
  };
};

export default useDistributor;
