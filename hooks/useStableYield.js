import { useEffect, useState, useContext } from 'react';
import { useWallet } from 'use-wallet';
import BigNumber from 'bignumber.js';
import useYam from './useYam';
import { DATA_UNAVAILABLE } from '../config';
import GlobalHooksContext from '../contexts/GlobalHooks/GlobalHooksContext';

const SECONDS_PER_WEEK = new BigNumber(604800);

const useStableYield = () => {
  const yam = useYam();
  const wallet = useWallet();
  const globalHooks = useContext(GlobalHooksContext);

  const [info, setInfo] = useState({
    hasDistribution: DATA_UNAVAILABLE,
    distribution: DATA_UNAVAILABLE,
    tip: DATA_UNAVAILABLE
  });


  const update = async () => {
    if (!yam || !wallet?.account) return;

    const timestamp = new BigNumber(globalHooks.blockInfo.block.timestamp.toString());
    const weeklyDELTAToSend = new BigNumber(yam.web3.eth.abi.decodeParameter('uint256', await yam.web3.eth.getStorageAt(yam.contracts.stableYield._address, 1)));
    const lastDistributionTime = new BigNumber(yam.web3.eth.abi.decodeParameter('uint256', await yam.web3.eth.getStorageAt(yam.contracts.stableYield._address, 2)));
    const enabled = yam.web3.eth.abi.decodeParameter('bool', await yam.web3.eth.getStorageAt(yam.contracts.stableYield._address, 3));
    const weeklyTip = new BigNumber(yam.web3.eth.abi.decodeParameter('uint256', await yam.web3.eth.getStorageAt(yam.contracts.stableYield._address, 4)));

    if (timestamp.isNaN()) {
      return;
    }

    console.log(timestamp.toString(), lastDistributionTime.toString());

    if (timestamp <= lastDistributionTime.plus(120) || !enabled) {
      setInfo({
        hasDistribution: false,
        distribution: new BigNumber(0),
        tip: new BigNumber(0)
      });

      return;
    }

    let timeDelta = timestamp.minus(lastDistributionTime);
    if(timeDelta >= SECONDS_PER_WEEK) {
      timeDelta = SECONDS_PER_WEEK;
    }
    
    const scale = new BigNumber(10).pow(4);
    const percentageOfAWeekPassede4 = timeDelta.times(scale).dividedBy(SECONDS_PER_WEEK);
    const distribution = weeklyDELTAToSend.times(percentageOfAWeekPassede4).div(scale);
    const tip = weeklyTip.times(percentageOfAWeekPassede4).div(scale);

    setInfo({
      distribution,
      tip,
      hasDistribution: distribution.gt(0)
    });
  };

  useEffect(() => {
    update();
  },[globalHooks.blockInfo.block.timestamp])

  useEffect(() => {
    update();
  }, [yam, wallet]);

  return {
    update,
    info,
  };
};

export default useStableYield;
