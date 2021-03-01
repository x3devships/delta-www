import { useEffect, useState } from 'react';
import { useWallet } from 'use-wallet';
import useYam from './useYam';
import { hooks } from '../helpers';
import { addressMap, DATA_UNAVAILABLE, tokenMap } from '../config';

const REFRESH_RATE = 30 * 1000;

const useStaking = () => {
  const yam = useYam();
  const wallet = useWallet();
  const [rlpStaked, setRlpStaked] = useState(DATA_UNAVAILABLE);
  const { decimals } = tokenMap[addressMap.delta];

  const update = async () => {
    if (!yam || !wallet?.account) return;

    // TODO: Replace using DFV contract
    const balance = (await yam.contracts.delta.methods.balanceOf(wallet.account).call()) / 10 ** decimals;
    setRlpStaked(balance);
  }

  // TODO: Enable Back When Ready
  /* useEffect(() => {
     let interval;
 
     if (yam) {
       update();
       interval = hooks.setWalletAwareInterval(wallet, update, REFRESH_RATE);
     }
 
     return () => clearInterval(interval);
   }, [yam, wallet]);
 */
  return {
    update,
    rlpStaked
  };
};

export default useStaking;
