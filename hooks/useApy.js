import { useState } from 'react';
import { DATA_UNAVAILABLE } from '../config';

const APY_REFRESH_RATE = 10 * 1000;

const useApy = () => {
  const [apy, setApy] = useState({
    eth_daily_delta: DATA_UNAVAILABLE,
    eth_daily_rlp_lsw: DATA_UNAVAILABLE,
    eth_daily_rlp_mint: DATA_UNAVAILABLE,
    eth_daily_rlp_uni: DATA_UNAVAILABLE,
    eth_weekly_delta: DATA_UNAVAILABLE,
    eth_weekly_rlp_lsw: DATA_UNAVAILABLE,
    eth_weekly_rlp_mint: DATA_UNAVAILABLE,
    eth_weekly_rlp_uni: DATA_UNAVAILABLE,
    eth_yearly_delta: DATA_UNAVAILABLE,
    eth_yearly_rlp_lsw: DATA_UNAVAILABLE,
    eth_yearly_rlp_mint: DATA_UNAVAILABLE,
    eth_yearly_rlp_uni: DATA_UNAVAILABLE,
    usdt_daily_delta: DATA_UNAVAILABLE,
    usdt_daily_rlp_lsw: DATA_UNAVAILABLE,
    usdt_daily_rlp_mint: DATA_UNAVAILABLE,
    usdt_daily_rlp_uni: DATA_UNAVAILABLE,
    usdt_weekly_delta: DATA_UNAVAILABLE,
    usdt_weekly_rlp_lsw: DATA_UNAVAILABLE,
    usdt_weekly_rlp_mint: DATA_UNAVAILABLE,
    usdt_weekly_rlp_uni: DATA_UNAVAILABLE,
    usdt_yearly_delta: DATA_UNAVAILABLE,
    usdt_yearly_rlp_lsw: DATA_UNAVAILABLE,
    usdt_yearly_rlp_mint: DATA_UNAVAILABLE,
    usdt_yearly_rlp_uni: DATA_UNAVAILABLE,
    using_latest_hours: DATA_UNAVAILABLE
  });

  setInterval(async () => {
    const response = await fetch('https://corecharts.info/apy');
    if (response.status === 200) {
      console.log("Successfully found the APY data.");

      const myData = await response.json();

      console.log(myData);

      setApy({
        eth_daily_delta: myData.apy_eth.daily.delta,
        eth_daily_rlp_lsw: myData.apy_eth.daily.rlp_lsw,
        eth_daily_rlp_mint: myData.apy_eth.daily.rlp_mint,
        eth_daily_rlp_uni: myData.apy_eth.daily.rlp_uni,
        eth_weekly_delta: myData.apy_eth.weekly.delta,
        eth_weekly_rlp_lsw: myData.apy_eth.weekly.rlp_lsw,
        eth_weekly_rlp_mint: myData.apy_eth.weekly.rlp_mint,
        eth_weekly_rlp_uni: myData.apy_eth.weekly.rlp_uni,
        eth_yearly_delta: myData.apy_eth.yearly.delta,
        eth_yearly_rlp_lsw: myData.apy_eth.yearly.rlp_lsw,
        eth_yearly_rlp_mint: myData.apy_eth.yearly.rlp_mint,
        eth_yearly_rlp_uni: myData.apy_eth.yearly.rlp_uni,
        usdt_daily_delta: myData.apy_usdt.daily.delta,
        usdt_daily_rlp_lsw: myData.apy_usdt.daily.rlp_lsw,
        usdt_daily_rlp_mint: myData.apy_usdt.daily.rlp_mint,
        usdt_daily_rlp_uni: myData.apy_usdt.daily.rlp_uni,
        usdt_weekly_delta: myData.apy_usdt.weekly.delta,
        usdt_weekly_rlp_lsw: myData.apy_usdt.weekly.rlp_lsw,
        usdt_weekly_rlp_mint: myData.apy_usdt.weekly.rlp_minE,
        usdt_weekly_rlp_uni: myData.apy_usdt.weekly.rlp_uni,
        usdt_yearly_delta: myData.apy_usdt.yearly.delta,
        usdt_yearly_rlp_lsw: myData.apy_usdt.yearly.rlp_lsw,
        usdt_yearly_rlp_mint: myData.apy_usdt.yearly.rlp_minE,
        usdt_yearly_rlp_uni: myData.apy_usdt.yearly.rlp_uni,
        using_latest_hours: myData.using_latest_hours
      });
    }
  }, APY_REFRESH_RATE);

  return {
    apy
  };
};

export default useApy;