import { useEffect, useState } from 'react';
import { coreChartsApyUrl, DATA_UNAVAILABLE } from '../config';

const REFRESH_RATE = 60 * 60 * 1000;

const getFormattedApy = value => {
  return value.toLocaleString('en', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

const useApy = () => {
  const [data, setData] = useState({
    eth_yearly_delta: DATA_UNAVAILABLE,
    eth_yearly_rlp_uni: DATA_UNAVAILABLE
  });

  const update = async () => {
    const response = await fetch(coreChartsApyUrl);
    if (response.status === 200) {
      const data = await response.json();

      setData({
        eth_yearly_delta: getFormattedApy(data.eth.yearly.delta * 10),
        eth_yearly_rlp_uni: getFormattedApy(data.eth.yearly.rlp_uni)
      });
    }
  }

  useEffect(() => {
    update();
    const interval = setInterval(update, REFRESH_RATE);

    return () => clearInterval(interval);
  }, []);

  return data;
};

export default useApy;