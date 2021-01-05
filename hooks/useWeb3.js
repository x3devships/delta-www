import { useContext } from 'react';
import { Web3Context } from '../contexts';

const useWeb3 = () => {
  const { web3 } = useContext(Web3Context);
  return web3;
};

export default useWeb3;
