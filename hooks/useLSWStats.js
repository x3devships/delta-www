import BigNumber from 'bignumber.js';
import { useEffect, useState } from 'react';
import { useWallet } from 'use-wallet';
import { useWeb3 } from '.';
import { DATA_UNAVAILABLE } from '../config';
import useYam from './useYam';

const initialState = {
  totalEthContributed: DATA_UNAVAILABLE,
  accountContributedEth: DATA_UNAVAILABLE,
  totalWETHEarmarkedForReferrers: DATA_UNAVAILABLE,
  referralBonusWETH: DATA_UNAVAILABLE,
  liquidityCredits: DATA_UNAVAILABLE
};

const useLSWStats = () => {
  const yam = useYam();
  const web3 = useWeb3();
  const wallet = useWallet();

  const [data, setData] = useState(initialState);

  const update = async () => {
    /**
     * This doesn't need to be connect to the account's wallet
     */
    if (web3) {
      const totalEthContributed = (await web3.contracts.wETH.methods.balanceOf(web3.contracts.LSW._address).call()) / 1e18;

      setData(data => ({
        ...data,
        totalEthContributed
      }));
    }

    /**
     * This section require the user to be connected to its wallet
     */
    if (yam && wallet?.account) {
      const account = '0x3AC618DCb800E733B0C390a23DE4aA796927A9B7'; // wallet.account;

      const accountContributedEth = (await yam.contracts.LSW.methods.liquidityContributedInETHUnitsMapping(account).call()) / 1e18;
      const referralBonusWETH = (await yam.contracts.LSW.methods.referralBonusWETH(account).call()) / 1e18;
      const totalWETHEarmarkedForReferrers = (await yam.contracts.LSW.methods.totalWETHEarmarkedForReferrers().call()) / 1e18;

      const liquidityCreditsBN = new BigNumber(await yam.contracts.LSW.methods.liquidityCreditsMapping(account).call());
      const rlpPerCreditBN = new BigNumber(await yam.contracts.LSW.methods.rlpPerCredit().call());
      const claimableRlpBN = liquidityCreditsBN.multipliedBy(rlpPerCreditBN).shiftedBy(-12);

      const liquidityCredits = liquidityCreditsBN.toString() / 1e18;
      const claimableRlp = claimableRlpBN.toString() / 1e18;

      setData(data => ({
        ...data,
        referralBonusWETH,
        liquidityCredits,
        accountContributedEth,
        totalWETHEarmarkedForReferrers,
        claimableRlp
      }));
    }
  };

  useEffect(() => {
    update();
  }, [yam, web3]);

  return {
    update,
    data
  };
};

export default useLSWStats;
