/* eslint-disable no-await-in-loop */
import { useEffect, useState } from 'react';
import { useWallet } from 'use-wallet';
import BigNumber from 'bignumber.js';
import useYam from './useYam';
import useWeb3 from './useWeb3';
import { DATA_UNAVAILABLE } from '../config';

const REFRESH_RATE = 30 * 1000;

const useWithdrawal = () => {
  const yam = useYam();
  const web3 = useWeb3();
  const wallet = useWallet();

  const [withdrawalContracts, setWithdrawalContracts] = useState(DATA_UNAVAILABLE);

  const update = async () => {
    if (!yam || !wallet?.account) return;

    const withdrawalAddresses = await yam.contracts.dfv.methods.allWithdrawalContractsOf(wallet.account).call();
    const withdrawals = [];

    for (let i = 0; i < withdrawalAddresses.length; i++) {
      const address = withdrawalAddresses[i];

      const contract = yam.contracts.getWithdrawalContract(address);

      const principalAmount = new BigNumber(await contract.methods.PRINCIPLE_DELTA().call());
      const vestingAmount = new BigNumber(await contract.methods.VESTING_DELTA().call());
      const withdrawableAmount = new BigNumber(await contract.methods.withdrawableTokens().call());
      const maturedVestingToken = new BigNumber(await contract.methods.maturedVestingTokens().call());
      const secondsLeftToMature = parseInt(await contract.methods.secondsLeftToMature().call());
      const secondsLeftUntilPrincipleUnlocked = parseInt(await contract.methods.secondsLeftUntilPrincipleUnlocked().call());
      const principleUnlocked = secondsLeftUntilPrincipleUnlocked === 0;
      const percentVested = (await contract.methods.percentMatured().call()) / 100;
      const principleWithdrawed = await contract.methods.principleWithdrawed().call();

      withdrawals.push({
        principalAmount,
        vestingAmount,
        secondsLeftToMature,
        withdrawableAmount,
        maturedVestingToken,
        percentVested,
        principleWithdrawed,
        secondsLeftUntilPrincipleUnlocked,
        principleUnlocked,
        hasVestingAmount: vestingAmount.gt(0),
        methods: contract.methods
      });
    }

    setWithdrawalContracts(withdrawals);
  };

  useEffect(() => {
    update();
    const interval = setInterval(update, REFRESH_RATE);
    return () => clearInterval(interval);
  }, [yam, web3, wallet]);

  return {
    withdrawalContracts
  };
};

export default useWithdrawal;
