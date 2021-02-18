import { useEffect, useState } from 'react';
import { useWallet } from 'use-wallet';
import { DATA_UNAVAILABLE } from '../config';
import useYam from './useYam';

const MAX_BONUS = 0.3;

const useLSWStats = () => {
  const yam = useYam();
  const wallet = useWallet();

  const [data, setData] = useState({
    percentCompletion: DATA_UNAVAILABLE,
    percentLeft: DATA_UNAVAILABLE,
    timeStart: DATA_UNAVAILABLE,
    timeEnd: DATA_UNAVAILABLE,
    secondsLeft: DATA_UNAVAILABLE,
    totalSeconds: DATA_UNAVAILABLE,
    personnalContributionAmount: DATA_UNAVAILABLE,
    currentTimeBonus: DATA_UNAVAILABLE
  });

  const update = async () => {
    if (!yam || !wallet?.account) return;

    const currentTime = new Date().valueOf();
    const timeStart = parseInt((await yam.contracts.LSW.methods.liquidityGenerationStartTimestamp().call()).toString());
    const timeEnd = parseInt((await yam.contracts.LSW.methods.liquidityGenerationEndTimestamp().call()).toString());
    const totalSeconds = parseInt((await yam.contracts.LSW.methods.LSW_RUN_TIME().call()).toString());

    let percentCompletion = DATA_UNAVAILABLE;
    let currentTimeBonus = DATA_UNAVAILABLE;
    let secondsLeft = DATA_UNAVAILABLE;
    let percentLeft = DATA_UNAVAILABLE;

    // is the LSW started?
    if (timeStart > 0) {
      percentCompletion = (timeEnd - timeStart) / timeEnd;
      secondsLeft = timeEnd - currentTime;
      percentLeft = secondsLeft / totalSeconds;
      currentTimeBonus = MAX_BONUS * percentLeft;
    }

    setData({
      timeStart,
      timeEnd,
      currentTimeBonus,
      secondsLeft,
      totalSeconds,
      percentCompletion,
      percentLeft
    });
  };

  useEffect(() => {
    let interval;

    if (yam) {
      update();
      interval = setInterval(update, 5000);
    }

    return () => clearInterval(interval);
  }, [yam]);

  return {
    update,
    data
  };
};

export default useLSWStats;
