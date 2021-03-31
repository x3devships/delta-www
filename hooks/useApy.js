import { useEffect, useState } from 'react';
import { coreChartsApyUrl, DATA_UNAVAILABLE } from '../config';

const REFRESH_RATE = 60 * 60 * 1000;

const useApy = () => {
  const [data, setData] = useState({
    usdt_yearly_delta: DATA_UNAVAILABLE
  });

  const update = async () => {
    const response = await fetch(coreChartsApyUrl);
    if (response.status === 200) {
      const data = await response.json();

      setData({
        usdt_yearly_delta: data.usdt.yearly.delta
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