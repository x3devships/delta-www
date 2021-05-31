import { useEffect, useState } from 'react';
import { useWallet } from 'use-wallet';
import useYam from './useYam';
import { DATA_UNAVAILABLE } from '../config';
import { hooks } from '../helpers';

const REFRESH_RATE = 30 * 1000;

const useRebasing = () => {
  const yam = useYam();
  const wallet = useWallet();

  // Here are the global vault's information, doesn't depend on connected wallet
  const [rebasingInfo, setRebasingInfo] = useState({
    nextRebaseTimestamp: DATA_UNAVAILABLE,
  });

  const update = async () => {
    if (!yam) return;

    const block = await yam.web3.eth.getBlock("latest");
    // TODO: Update global vault infos, doesn't require connected wallet
    // Call web3 vault to get the infos.
    setRebasingInfo({
      nextRebaseTimestamp: block.timestamp + (60 * 60 * 24 * 2)
    });
  };

  useEffect(() => {
    update();
    const interval = hooks.setWalletAwareInterval(wallet, update, REFRESH_RATE);
    return () => clearInterval(interval);
  }, [yam]);

  return {
    update,
    rebasingInfo
  };
};

export default useRebasing;
