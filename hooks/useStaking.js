import { useEffect, useState } from 'react';
import { useWallet } from 'use-wallet';
import BigNumber from 'bignumber.js';
import useYam from './useYam';
import useWeb3 from './useWeb3';
import { DATA_UNAVAILABLE } from '../config';

const REFRESH_RATE = 30 * 1000;

const useStaking = () => {
  const yam = useYam();
  const web3 = useWeb3();
  const wallet = useWallet();

  // Here are the global vault's information, doesn't depend on connected wallet
  const [vaultStats, setVaultStats] = useState({
    amountTotal: DATA_UNAVAILABLE,
    apy: DATA_UNAVAILABLE
  });

  const [rlpPerLp, setRlpPerLp] = useState(DATA_UNAVAILABLE);

  const [info, setInfo] = useState({
    booster: DATA_UNAVAILABLE, // Current staking booster 1x-10x
    farmedDelta: DATA_UNAVAILABLE, // Amount of farmed Delta
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
    compoundBurn: DATA_UNAVAILABLE // A boolean that sets compounding effect, either burn maintaining multiplier or just adding. 
  });

  const update = async () => {
    if (!web3) return;

    // TODO: Update global vault infos, doesn't require connected wallet
    // Call web3 vault to get the infos.
    setVaultStats({
      delta: {
        amountTotal: 123,
        apy: 999
      },
      rLP: {
        amountTotal: 654,
        apy: 635
      }
    });

    if (!yam || !wallet?.account) return;

    const userInfo = await yam.contracts.dfv.methods.userInfo(wallet.account).call();
    const recycleInfo = await yam.contracts.dfv.methods.realFarmedOfPerson(wallet.account).call();

    const rlpPerLP = await yam.contracts.rLP.methods.rlpPerLP().call();

    setRlpPerLp(rlpPerLP);

    const farmedDelta = new BigNumber(userInfo.deltaVesting);
    const farmedETH = new BigNumber(recycleInfo.farmedETH);
    const recycledDelta = new BigNumber(recycleInfo.recycledDelta);
    const recycledETH = new BigNumber(recycleInfo.recycledETH);
    const deltaPermanent = new BigNumber(userInfo.deltaPermanent);  // Never withdrawable
    const deltaVesting = new BigNumber(userInfo.deltaVesting); // Amount that needs to vest 12 months to be claimable
    const deltaWithdrawable = new BigNumber(userInfo.deltaWithdrawable); // Amount that can be withdrawn right away (with 2 week vesting)
    const totalDelta = new BigNumber(userInfo.totalDelta); // Sum of them all (delta only no rlp)
    const rlp = new BigNumber(userInfo.rlp);  // amount of rlp this user has
    const lastBoosterDepositTimestamp = parseInt(userInfo.lastBoosterDepositTimestamp); // timestamp of the last booster deposit

    setInfo({
      booster: recycleInfo.booster,
      farmedDelta,
      farmedETH,
      recycledDelta,
      recycledETH,
      stakedDelta: totalDelta.minus(deltaPermanent),
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
  }, [yam, web3, wallet]);

  return {
    update,
    info,
    vaultStats,
    rlpPerLp
  };
};

export default useStaking;
