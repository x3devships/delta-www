import { ethers } from 'ethers';
import { useEffect, useState } from 'react';
import { useWallet } from 'use-wallet';
import Cookies from 'js-cookie'
import { DATA_UNAVAILABLE } from '../config';
import useYam from './useYam';

const MAX_TIME_BONUS = 0.3;
const MAX_BONUS = 0.4;
const REFERRAL_BONUS = 0.1;

const initialState = {
  percentCompletion: DATA_UNAVAILABLE,
  timeStart: DATA_UNAVAILABLE,
  timeEnd: DATA_UNAVAILABLE,
  secondsLeft: DATA_UNAVAILABLE,
  totalSeconds: DATA_UNAVAILABLE,
  currentTimeBonus: DATA_UNAVAILABLE,
  refCode: DATA_UNAVAILABLE,
  refAddress: ethers.constants.AddressZero,
  totalEthContributed: DATA_UNAVAILABLE,
  accountContributedEth: DATA_UNAVAILABLE,
  totalWETHEarmarkedForReferrers: DATA_UNAVAILABLE,
  referralBonusWETH: DATA_UNAVAILABLE,
  liquidityCredits: DATA_UNAVAILABLE,
  estimatedClaimableRlp: DATA_UNAVAILABLE
};

const useLSWStats = () => {
  const yam = useYam();
  const wallet = useWallet();

  const [data, setData] = useState(initialState);

  const update = async () => {
    if (!yam || !wallet?.account) return;

    const accountContributedEth = (await yam.contracts.LSW.methods.liquidityContributedInETHUnitsMapping(wallet.account).call()) / 1e18;
    const liquidityCredits = (await yam.contracts.LSW.methods.liquidityCreditsMapping(wallet.account).call()) / 1e18;
    const referralBonusWETH = (await yam.contracts.LSW.methods.referralBonusWETH(wallet.account).call()) / 1e18;
    const estimatedClaimableRlp = liquidityCredits * 3.7015398583226107;

    const timeStart = parseInt(await yam.contracts.LSW.methods.liquidityGenerationStartTimestamp().call());
    const timeEnd = parseInt(await yam.contracts.LSW.methods.liquidityGenerationEndTimestamp().call());
    const totalEthContributed = (await yam.contracts.wETH.methods.balanceOf(yam.contracts.LSW._address).call()) / 1e18;
    const totalWETHEarmarkedForReferrers = (await yam.contracts.LSW.methods.totalWETHEarmarkedForReferrers().call()) / 1e18;
    const totalSeconds = parseInt(await yam.contracts.LSW.methods.LSW_RUN_TIME().call());
    const currentTimestamp = Date.now() / 1000;
    const lastRef = localStorage.getItem('lastRef') || Cookies.get('lastRef');
    const walletAddress = yam.web3.utils.toChecksumAddress(wallet.account);

    let currentReferralBonus = 0;
    let refAddress = ethers.constants.AddressZero;
    let refCode = 0;

    // Check if the ref code is a valid ethereum address
    if (yam.web3.utils.isAddress(lastRef)) {
      const address = yam.web3.utils.toChecksumAddress(lastRef);
      if (address !== walletAddress) {
        refAddress = address;
        currentReferralBonus = REFERRAL_BONUS;

      }
    }

    // Check if the referral code is an id
    else if (!Number.isNaN(parseInt(lastRef))) {
      let address = await yam.contracts.LSW.methods.referralCodeMappingIndexedByID(lastRef).call();
      address = yam.web3.utils.toChecksumAddress(address);

      if (address !== ethers.constants.AddressZero && address !== walletAddress) {
        currentReferralBonus = REFERRAL_BONUS;
        refCode = lastRef;
      }
    }
    let currentTimeBonus = DATA_UNAVAILABLE;
    let secondsLeft = DATA_UNAVAILABLE;

    // is the LSW started?
    if (timeStart > 0) {
      secondsLeft = timeEnd - currentTimestamp;
      currentTimeBonus = Math.trunc(MAX_TIME_BONUS * secondsLeft / totalSeconds * 100) / 100;
    }

    setData({
      timeStart,
      timeEnd,
      currentTimeBonus,
      maxBonus: MAX_BONUS,
      currentReferralBonus,
      secondsLeft,
      totalSeconds,
      referralBonusWETH,
      liquidityCredits,
      refCode,
      refAddress,
      totalEthContributed,
      accountContributedEth,
      totalWETHEarmarkedForReferrers,
      estimatedClaimableRlp
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
