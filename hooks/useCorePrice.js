import { useEffect, useState } from 'react';
import { singletonHook } from 'react-singleton-hook';
import { DATA_UNAVAILABLE } from '../config';
import useETHPrice from './useETHPrice';
import useUniswapPairBalances from './useUniswapPairBalances';

const initialState = {
  inUSD: DATA_UNAVAILABLE,
  inETH: DATA_UNAVAILABLE
};

const useCorePrice = () => {
  const { balanceCore, balanceToken } = useUniswapPairBalances('CORExWETH');
  const ethPrice = useETHPrice();
  const [prices, setPrices] = useState(initialState);

  useEffect(() => {
    if (
      balanceCore !== DATA_UNAVAILABLE &&
      balanceToken !== DATA_UNAVAILABLE &&
      ethPrice !== DATA_UNAVAILABLE
    ) {
      const coreValueInToken = balanceToken / balanceCore;
      setPrices({
        inUSD: coreValueInToken * ethPrice,
        inETH: coreValueInToken
      });
    }
  }, [balanceCore, balanceToken, ethPrice]);

  return prices;
};

export default singletonHook(initialState, useCorePrice);
