import { useEffect, useState } from 'react';
import { DATA_UNAVAILABLE } from '../config';
import useETHPrice from './useETHPrice';
import useWeb3 from './useWeb3';

const initialState = DATA_UNAVAILABLE;

const useWBTCPrice = () => {
  const web3 = useWeb3();
  const ethPrice = useETHPrice();

  const [WBTCPrice, setWBTCPrice] = useState(initialState);

  useEffect(() => {
    const updateWBTCPrice = async () => {
      if (ethPrice !== DATA_UNAVAILABLE) {
        const pairReserves = await web3.contracts.WBTCxWETH.methods.getReserves().call();
        const priceOfWBTCinWETH = parseFloat(pairReserves.reserve1 / 1e18 / (pairReserves.reserve0 / 1e8));
        const priceOfWBTCinUSDT = priceOfWBTCinWETH * ethPrice;
        setWBTCPrice(priceOfWBTCinUSDT);
      }
    };

    updateWBTCPrice();
  }, [ethPrice]);

  return WBTCPrice;
};

export default useWBTCPrice;
