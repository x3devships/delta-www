import { useEffect, useState } from 'react';
import { useWallet } from 'use-wallet';
import useYam from './useYam';
import { hooks } from '../helpers';
import { addressMap, DATA_UNAVAILABLE, TEMP_ENABLE_END_LSW_WEB3, tokenMap } from '../config';

const REFRESH_RATE = 30 * 1000;

const useStaking = () => {
  const yam = useYam();
  const wallet = useWallet();
  const [rlpStaked, setRlpStaked] = useState(DATA_UNAVAILABLE);
  const [withdrawalContracts, setWithdrawalContracts] = useState([]);
  const { decimals } = tokenMap[addressMap.delta];

  const update = async () => {
    if (!yam || !wallet?.account) return;

    // TODO: Replace using DFV contract
    const balance = (await yam.contracts.delta.methods.balanceOf(wallet.account).call()) / 10 ** decimals;
    setRlpStaked(balance);

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
  }


  useEffect(() => {
    if (TEMP_ENABLE_END_LSW_WEB3) {
      let interval;

      if (yam) {
        update();
        interval = hooks.setWalletAwareInterval(wallet, update, REFRESH_RATE);
      }

      return () => clearInterval(interval);
    }
  }, [yam, wallet]);

  return {
    update,
    rlpStaked,
    withdrawalContracts
  };
};

export default useStaking;
