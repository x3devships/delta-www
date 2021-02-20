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
  currentTimeBonus: DATA_UNAVAILABLE,
  refCode: DATA_UNAVAILABLE,
  totalEthContributed: DATA_UNAVAILABLE,
  totalWETHEarmarkedForReferrers: DATA_UNAVAILABLE
};

const useLSWStats = () => {
  const yam = useYam();
  const wallet = useWallet();

  const [data, setData] = useState(initialState);

  const update = async () => {
    if (!yam || !wallet?.account) return;

    const timeStart = parseInt(await yam.contracts.LSW.methods.liquidityGenerationStartTimestamp().call());
    const timeEnd = parseInt(await yam.contracts.LSW.methods.liquidityGenerationEndTimestamp().call());
    const totalEthContributed = (await yam.contracts.wETH.methods.balanceOf(yam.contracts.LSW._address).call()) / 1e18;
    const totalWETHEarmarkedForReferrers = (await yam.contracts.LSW.methods.totalWETHEarmarkedForReferrers().call()) / 1e18;
    const totalSeconds = parseInt(await yam.contracts.LSW.methods.LSW_RUN_TIME().call());
    const currentTimestamp = Date.now() / 1000;
    let currentReferralBonus = 0;

    let refCode = parseInt(localStorage.getItem('lastRef'));

    /**
     * Verify if the referral id is good.
     */
    if (!Number.isNaN(refCode)) {
      let address = await yam.contracts.LSW.methods.referralCodeMappingIndexedByID(refCode).call();
      address = yam.web3.utils.toChecksumAddress(address);
      const walletAddress = yam.web3.utils.toChecksumAddress(wallet.account);

      if (address !== ethers.constants.AddressZero || address !== walletAddress) {
        currentReferralBonus = REFERRAL_BONUS;
      }
    } else {
      refCode = 0;
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
      percentLeft,
      refCode,
      totalEthContributed,
      totalWETHEarmarkedForReferrers
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
