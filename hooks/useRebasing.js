import { useEffect, useState } from 'react';
import useWeb3 from './useWeb3';
import { DATA_UNAVAILABLE } from '../config';

const REFRESH_RATE = 30 * 1000;

const useRebasing = () => {
  const web3 = useWeb3();

  // Here are the global vault's information, doesn't depend on connected wallet
  const [rebasingInfo, setRebasingInfo] = useState({
    nextRebaseTimestamp: DATA_UNAVAILABLE,
  });

  const update = async () => {
    if (!web3) return;

    // TODO: Update global vault infos, doesn't require connected wallet
    // Call web3 vault to get the infos.
    setRebasingInfo({
      nextRebaseTimestamp: Date.now() + 123456789
    });
  };

  useEffect(() => {
    update();
    const interval = setTimeout(update, REFRESH_RATE);
    return () => clearInterval(interval);
  }, [web3]);

  return {
    update,
    rebasingInfo
  };
};

export default useRebasing;
