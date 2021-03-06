import { useEffect, useState } from 'react';
import { useWallet } from 'use-wallet';
import useYam from './useYam';
import useWeb3 from './useWeb3';
import { hooks } from '../helpers';
import { addressMap, DATA_UNAVAILABLE, TEMP_ENABLE_END_LSW_WEB3, tokenMap } from '../config';

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

  // TODO: Enter the information about the user's rLP staking
  const [rlpInfo, setRlpInfo] = useState({
    amountStaked: DATA_UNAVAILABLE,
    claimableEth: DATA_UNAVAILABLE,
    claimableDelta: DATA_UNAVAILABLE,
    rewardMultiplier: DATA_UNAVAILABLE
  });

  // TODO: Enter the information about the user's Delta staking
  const [deltaInfo, setDeltaInfo] = useState({
    amountStaked: DATA_UNAVAILABLE,
    claimableEth: DATA_UNAVAILABLE,
    claimableDelta: DATA_UNAVAILABLE,
    rewardMultiplier: DATA_UNAVAILABLE,
    timeUntilDowngrade: DATA_UNAVAILABLE
  });

  const [withdrawalContracts, setWithdrawalContracts] = useState([]);
  const { decimals } = tokenMap[addressMap.delta];

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


    /**
     * This section requires a connected wallet
     */
    if (!yam || !wallet?.account) return;

    // TODO: Replace using DFV contract
    // const balance = (await yam.contracts.delta.methods.balanceOf(wallet.account).call()) / 10 ** decimals;
    setRlpInfo({
      amountStaked: 123,
      claimableEth: 456,
      claimableDelta: 567,
      rewardMultiplier: 20
    });

    setDeltaInfo({
      amountStaked: 123,
      claimableEth: 456,
      claimableDelta: 888,
      rewardMultiplier: 8,
      timeUntilDowngrade: Date.now() + 8888898
    });

    // TODO: remove mock data and use real contract
    setWithdrawalContracts([
      {
        amount: 110,
        fullVestingTimestamp: Date.now() * 1000,
        immature: 100,
        mature: 10,
        percentVested: 0.1
      },
      {
        amount: 220,
        fullVestingTimestamp: (Date.now() * 1000) - 99999,
        immature: 0.8 * 220,
        mature: 0.2 * 220,
        percentVested: 0.2
      },
      {
        amount: 3568,
        fullVestingTimestamp: (Date.now() * 1000) - 12323,
        immature: 0.5 * 3568,
        mature: 0.5 * 3568,
        percentVested: 0.5
      }
    ]);
  };

  useEffect(() => {
    update(); // NEED DELETE @midas
    if (TEMP_ENABLE_END_LSW_WEB3) {
      update();
      const interval = setTimeout(update, REFRESH_RATE);
      return () => clearInterval(interval);
    }
  }, [yam, web3, wallet]);

  return {
    update,
    rlpInfo,
    deltaInfo,
    vaultStats,
    withdrawalContracts
  };
};

export default useStaking;
