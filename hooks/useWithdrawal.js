import { useEffect, useState } from 'react';
import { useWallet } from 'use-wallet';
import useYam from './useYam';
import useWeb3 from './useWeb3';
import { DATA_UNAVAILABLE } from '../config';

const REFRESH_RATE = 30 * 1000;

const useWithdrawal = () => {
  const yam = useYam();
  const web3 = useWeb3();
  const wallet = useWallet();

  const [withdrawalContracts, setWithdrawalContracts] = useState([]);

  const update = async () => {
    if (!yam || !wallet?.account) return;

    const withdrawalAddresses = await yam.contracts.dfv.methods.allWithdrawalContractsOf(wallet.account).call();

    console.log(withdrawalAddresses);
    const withdrawals = await Promise.all(withdrawalAddresses.map(async address => {
      console.log(address);
      const contract = yam.contracts.getWithdrawalContract(address);

      const deltaTokenAddress = await contract.methods.deltaTokenAddress().call();
      const principalAmount = await contract.methods.PRINCIPLE_DELTA().call();
      const vestingAmount = await contract.methods.VESTING_DELTA().call();
      const secondsLeftToMature = await contract.methods.secondsLeftToMature().call();
      const withdrawableAmount = await contract.methods.withdrawableTokens().call();
      const maturedVestingToken = await contract.methods.maturedVestingTokens().call();
      const percentMatured = await contract.methods.percentMatured().call();

      // TODO: Returns the info to be returned for each withdrawal contracts.
      return {
        withdrawableAmount,
        principalAmount,
        vestingAmount,
        secondsLeftToMature,
        percentMatured,
        maturedVestingToken
      }
    }));

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
