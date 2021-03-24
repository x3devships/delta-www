import { useEffect, useState } from 'react';
import { useWallet } from 'use-wallet';
import useYam from './useYam';
import useWeb3 from './useWeb3';
import { DATA_UNAVAILABLE } from '../config';

const REFRESH_RATE = 30 * 1000;

const useStaking = () => {
  const yam = useYam();
  const web3 = useWeb3();
  const wallet = useWallet();

  const [withdrawalContracts, setWithdrawalContracts] = useState([]);

  const update = async () => {
    if (!yam || !wallet?.account) return;

    const withdrawalAddresses = await yam.contracts.dfv.methods.withdrawalContracts(wallet.account).call();

    const withdrawals = await Promise.all(withdrawalAddresses.map(async address => {
      const contract = yam.contracts.getWithdrawalContract(address);

      const principalAmount = await contract.PRINCIPLE_DELTA().call();
      const vestingAmount = await contract.PRINCIPLE_DELTA().call();

      // TODO: Returns the info to be returned for each withdrawal contracts.
      return {

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

export default useStaking;
