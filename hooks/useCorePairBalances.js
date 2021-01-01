import { useEffect, useState } from 'react';
import { DATA_UNAVAILABLE, pairInfoMap } from '../config';
import useYam from './useYam';

const REFRESH_RATE = 60 * 1000;

/**
 * Retrieves the reserve amount of a given core pair.
 */
const useCorePairBalances = pairName => {
  const pairInfo = pairInfoMap[pairName];

  const yam = useYam();
  const [balances, setBalances] = useState({
    balanceToken: DATA_UNAVAILABLE,
    balanceCore: DATA_UNAVAILABLE
  });

  async function update() {
    const pair = yam.contracts[pairName];
    const balances = await pair.methods.getReserves().call();
    let balanceCore;
    let balanceToken;

    if (pairInfo.reserve1.friendlyName === 'CORE') {
      balanceCore = balances.reserve1 / 10 ** pairInfo.reserve1.decimals;
      balanceToken = balances.reserve0 / 10 ** pairInfo.reserve0.decimals;
    } else {
      balanceCore = balances.reserve0 / 10 ** pairInfo.reserve0.decimals;
      balanceToken = balances.reserve1 / 10 ** pairInfo.reserve1.decimals;
    }

    setBalances({
      balanceToken,
      balanceCore
    });
  }

  useEffect(() => {
    let interval;

    if (yam) {
      update();
      interval = setInterval(update, REFRESH_RATE);
    }

    return () => clearInterval(interval);
  }, [yam]);

  return balances;
};

export default useCorePairBalances;
