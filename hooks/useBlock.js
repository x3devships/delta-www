import { useEffect, useState } from 'react';
import moment from 'moment';
import { useWallet } from 'use-wallet';
import useYam from './useYam';
import { DATA_UNAVAILABLE } from '../config';
import { hooks } from '../helpers';

const REFRESH_RATE = 10 * 1000;

const useBlock = () => {
  const yam = useYam();
  const wallet = useWallet();

  // Here are the global vault's information, doesn't depend on connected wallet
  const [block, setBlock] = useState({
    number: DATA_UNAVAILABLE,
    timestamp: DATA_UNAVAILABLE,
    date: DATA_UNAVAILABLE
  });

  const update = async () => {
    if (!yam) return;

    const block = await yam.web3.eth.getBlock("latest");
    setBlock({
      number: block.number,
      timestamp: block.timestamp,
      date: moment(block.timestamp * 1000)
    });
  };

  useEffect(() => {
    update();
    const interval = hooks.setWalletAwareInterval(wallet, update, REFRESH_RATE);
    return () => clearInterval(interval);
  }, [yam]);

  return {
    update,
    block
  };
};

export default useBlock;
