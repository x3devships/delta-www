import { ethers } from 'ethers';
import { useEffect, useState } from 'react';
import { useWallet } from 'use-wallet';
import { DATA_UNAVAILABLE } from '../config';
import useYam from './useYam';

const MAX_TIME_BONUS = 0.3;
const MAX_BONUS = 0.4;
const REFERRAL_BONUS = 0.1;

const initialState = {
  percentCompletion: DATA_UNAVAILABLE,
  percentLeft: DATA_UNAVAILABLE,
  timeStart: DATA_UNAVAILABLE,
  timeEnd: DATA_UNAVAILABLE,
  secondsLeft: DATA_UNAVAILABLE,
  totalSeconds: DATA_UNAVAILABLE,
  currentTimeBonus: DATA_UNAVAILABLE
};

const useLSWStats = () => {
  const yam = useYam();
  const wallet = useWallet();

  const [data, setData] = useState(initialState);

  const update = async () => {
    if (!yam || !wallet?.account) return;

    const timeStart = parseInt(await yam.contracts.LSW.methods.liquidityGenerationStartTimestamp().call());
    const timeEnd = parseInt(await yam.contracts.LSW.methods.liquidityGenerationEndTimestamp().call());
    const totalSeconds = parseInt(await yam.contracts.LSW.methods.LSW_RUN_TIME().call());
    const currentTimestamp = Date.now() / 1000;
    let currentReferralBonus = 0;

    const refId = parseInt(localStorage.getItem('lastRef'));

    /**
     * Verify if the referral id is good.
     */
    if (!Number.isNaN(refId)) {
      const address = await yam.contracts.LSW.methods.referralCodeMappingIndexedByID(refId).call();

      if (address !== ethers.constants.AddressZero) {
        currentReferralBonus = REFERRAL_BONUS;
      }
    }

    let percentCompletion = 0;
    let currentTimeBonus = DATA_UNAVAILABLE;
    let secondsLeft = DATA_UNAVAILABLE;
    let percentLeft = DATA_UNAVAILABLE;

    // is the LSW started?
    if (timeStart > 0) {
      percentCompletion = (currentTimestamp - timeStart) / totalSeconds;
      secondsLeft = timeEnd - currentTimestamp;
      percentLeft = secondsLeft / totalSeconds;
      currentTimeBonus = MAX_TIME_BONUS * percentLeft;
    }

    setData({
      timeStart,
      timeEnd,
      currentTimeBonus,
      maxBonus: MAX_BONUS,
      currentReferralBonus,
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
