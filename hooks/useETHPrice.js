import { useEffect, useState } from 'react';
import { singletonHook } from 'react-singleton-hook';
import { DATA_UNAVAILABLE } from '../config';
import useWeb3 from './useWeb3';

const PRICE_REFRESH_INTERVAL = 30 * 1000;
const initialState = DATA_UNAVAILABLE;

const useETHPrice = () => {
  const web3 = useWeb3();
  const [ETHprice, setETHPrice] = useState(initialState);

  async function update() {
    const priceOfUSDTinETH = await web3.contracts.UNIUSDT.methods.getReserves().call();

    setETHPrice(parseFloat(priceOfUSDTinETH.reserve1 / 1e6 / (priceOfUSDTinETH.reserve0 / 1e18)));
  }

  useEffect(() => {
    let interval;

    if (web3) {
      update();
      interval = setInterval(update, PRICE_REFRESH_INTERVAL);
    }

    return () => clearInterval(interval);
  }, [web3]);

  return ETHprice;
};

export default singletonHook(initialState, useETHPrice);
