import { useEffect, useState } from 'react';
import { useWallet } from 'use-wallet';
import EthDater from 'ethereum-block-by-date';
import _ from 'lodash';
import useYam from './useYam';

const LSW_STARTDATE_IN_MILLIS = 1614011341 * 1000;
const REFRESH_RATE = 1 * 60 * 60 * 1000; // once per minute

const getLocalStorageKey = address => `chart_refrewards_${address}`;

const useReferralRewardsChartData = () => {
  const yam = useYam();
  const wallet = useWallet();

  const [data, setData] = useState([]);

  const update = async () => {
    if (!yam || !wallet?.account) return;

    let currentData = data;

    const address = wallet.account;
    console.log('Updating useReferralRewardsChartData...');

    if (currentData.length === 0) {
      const key = getLocalStorageKey(address);
      const storedData = localStorage.getItem(key);

      if (storedData) {
        try {
          currentData = JSON.parse(storedData);
          setData(currentData);
        } catch {
          localStorage.removeItem(key);
        }
      }
    }
    let lastBlockTimestamp = LSW_STARTDATE_IN_MILLIS;

    if (currentData.length > 0) {
      const lastSample = currentData[currentData.length - 1];
      lastBlockTimestamp = new Date(lastSample.date).valueOf();
    }

    const dater = new EthDater(yam.web3);

    // Only fetch the missing new blocks
    const newBlockInfo = [];// await dater.getEvery('hours', lastBlockTimestamp, Date.now());

    // Fetch the new information for these blocks
    const newChartData = await Promise.all(newBlockInfo.map(async blockInfo => {
      const referralBonusWETH = (await yam.contracts.LSW.methods.referralBonusWETH(address).call({
        from: address
      }, blockInfo.block)) / 1e18;
      return {
        ...blockInfo,
        referralBonusWETH
      }
    }));

    setData(data => {
      const previousLength = data.length;

      // Concatenate and remove duplicated block entries
      const newData = _.uniqBy([...data, ...newChartData], 'date');

      console.log(`useReferralRewardsChartData: fetched ${newData.length - previousLength} new datablocks.`);

      localStorage.setItem(getLocalStorageKey(address), JSON.stringify(newData));
      return newData;
    });
  };

  useEffect(() => {
    update();
    const interval = setInterval(update, REFRESH_RATE);
    return () => clearInterval(interval);
  }, [yam]);

  return {
    update,
    data
  };
};

export default useReferralRewardsChartData;
