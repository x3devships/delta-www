import { useEffect, useState } from 'react';
import { useWallet } from 'use-wallet';
import EthDater from 'ethereum-block-by-date';
import _ from 'lodash';
import useWeb3 from './useWeb3';

const LSW_STARTDATE_IN_MILLIS = 1614011341 * 1000;
const REFRESH_RATE = 1 * 60 * 60 * 1000; // once per minute

const getLocalStorageKey = address => `chart_refrewards_${address}`;

const useReferralRewardsChartData = () => {
  const web3 = useWeb3();
  const { account } = useWallet();

  const [data, setData] = useState([]);

  const update = async () => {
    if (!web3 || !account) return;

    let currentData = data;

    const address = '0x3AC618DCb800E733B0C390a23DE4aA796927A9B7'; // account;
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
    let lastBlockTimestamp = Date.now() - (3 * 24 * 60 * 60 * 1000);// LSW_STARTDATE_IN_MILLIS;

    if (currentData.length > 0) {
      const lastSample = currentData[currentData.length - 1];
      lastBlockTimestamp = new Date(lastSample.date).valueOf();
    }

    const dater = new EthDater(web3.web3);

    // Only fetch the missing new blocks
    const newBlockInfo = await dater.getEvery('days', lastBlockTimestamp, Date.now());

    // Fetch the new information for these blocks
    const newChartData = await Promise.all(newBlockInfo.map(async blockInfo => {
      const referralBonusWETH = (await web3.contracts.LSW.methods.referralBonusWETH(address).call({}, blockInfo.block)) / 1e18;
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
  }, [web3, account]);

  return {
    update,
    data
  };
};

export default useReferralRewardsChartData;
