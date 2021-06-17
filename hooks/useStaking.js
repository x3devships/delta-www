import { useEffect, useState } from 'react';
import { useWallet } from 'use-wallet';
import BigNumber from 'bignumber.js';
import useYam from './useYam';
import { DATA_UNAVAILABLE } from '../config';

const REFRESH_RATE = 30 * 1000;

const useStaking = () => {
  const yam = useYam();
  const wallet = useWallet();

  const [rlpPerLp, setRlpPerLp] = useState(DATA_UNAVAILABLE);

  const [info, setInfo] = useState({
    booster: DATA_UNAVAILABLE, // Current staking booster 1x-10x
    farmedDelta: DATA_UNAVAILABLE, // Amount of farmed DELTA
    farmedETH: DATA_UNAVAILABLE, // Amount of farmed Eth
    recycledDelta: DATA_UNAVAILABLE,
    recycledETH: DATA_UNAVAILABLE,
    deltaPermanent: DATA_UNAVAILABLE,  // Never withdrawable
    deltaVesting: DATA_UNAVAILABLE, // Amount that needs to vest 12 months to be claimable 
    deltaWithdrawable: DATA_UNAVAILABLE, // Amount that can be withdrawn right away (with 2 week vesting)
    totalDelta: DATA_UNAVAILABLE, // Sum of them all (delta only no rlp),
    stakedDelta: DATA_UNAVAILABLE, // deltaTotal - deltaPermanent
    rlp: DATA_UNAVAILABLE,  // amount of rlp this user has
    lastBoosterDepositTimestamp: DATA_UNAVAILABLE, // timestamp of the last booster deposit
    compoundBurn: DATA_UNAVAILABLE, // A boolean that sets compounding effect, either burn maintaining multiplier or just adding.
    hasFarmedDelta: false,
    hasFarmedETH: false,
    hasStakedRlp: false
  });

  const update = async () => {
    if (!yam || !wallet?.account) return;

    const userInfo = await yam.contracts.dfv.methods.userInfo(wallet.account).call();
    const recycleInfo = await yam.contracts.dfv.methods.realFarmedOfPerson(wallet.account).call();

    const rlpPerLP = await yam.contracts.rLP.methods.rlpPerLP().call();

    setRlpPerLp(rlpPerLP);

    const farmedDelta = new BigNumber(recycleInfo.farmedDelta);
    const farmedETH = new BigNumber(recycleInfo.farmedETH);
    const recycledDelta = new BigNumber(recycleInfo.recycledDelta);
    const recycledETH = new BigNumber(recycleInfo.recycledETH);
    const deltaPermanent = new BigNumber(userInfo.deltaPermanent);  // Never withdrawable
    const deltaVesting = new BigNumber(userInfo.deltaVesting); // Amount that needs to vest 12 months to be claimable
    const deltaWithdrawable = new BigNumber(userInfo.deltaWithdrawable); // Amount that can be withdrawn right away (with 2 week vesting)
    const totalDelta = new BigNumber(userInfo.totalDelta); // Sum of them all (delta only no rlp)
    const rlp = new BigNumber(userInfo.rlp);  // amount of rlp this user has
    const lastBoosterDepositTimestamp = parseInt(userInfo.lastBoosterDepositTimestamp); // timestamp of the last booster deposit

    const hasFarmedDelta = farmedDelta.gt(0);
    const hasFarmedETH = farmedETH.gt(0);
    const hasStakedRlp = rlp.gt(0);

    setInfo({
      hasFarmedDelta,
      hasFarmedETH,
      hasStakedRlp,
      booster: recycleInfo.booster,
      farmedDelta,
      farmedETH,
      recycledDelta,
      recycledETH,
      ableToWithdrawDelta: totalDelta.minus(deltaPermanent).plus(farmedDelta), // this is withdrawble + vesting + farmed 
      deltaPermanent,
      deltaVesting,
      deltaWithdrawable,
      totalDelta,
      rlp,
      lastBoosterDepositTimestamp,
      compoundBurn: !!userInfo.compoundBurn // A boolean that sets compounding effect, either burn maintaining multiplier or just adding. 
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
    rlpPerLp
  };
};

export default useStaking;
