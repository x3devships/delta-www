import { useEffect, useState } from 'react';
import moment from 'moment';
import useYam from './useYam';
import { DATA_UNAVAILABLE } from '../config';

const REFRESH_RATE = 10 * 1000;

const useBlock = () => {
  const yam = useYam();

  // Here are the global vault's information, doesn't depend on connected wallet
  const [block, setBlock] = useState({
    number: DATA_UNAVAILABLE,
    timestamp: DATA_UNAVAILABLE,
    date: DATA_UNAVAILABLE
  });

  const update = async () => {
    if (!yam) return;

    const newBlock = await yam.web3.eth.getBlock("latest");
    
    if (newBlock.number !== block.number) {
      setBlock({
        number: newBlock.number,
        timestamp: newBlock.timestamp,
        date: moment(newBlock.timestamp * 1000)
      });
    }
  };

  useEffect(() => {
    update();
    const interval = setInterval(update, REFRESH_RATE);
    return () => clearInterval(interval);
  }, [yam]);

  return {
    update,
    block
  };
};

export default useBlock;
