import { useEffect, useState } from 'react';
import Web3Context from './Web3Context';
import { Web3Client } from '../../web3';
import { WEB3_PROVIDER_URL } from '../../config';

const Web3Provider = ({ children }) => {
  const [web3, setWeb3] = useState();

  useEffect(() => {
    const web3 = new Web3Client(WEB3_PROVIDER_URL);
    setWeb3(web3);
  }, []);

  return (
    <Web3Context.Provider value={{ web3 }}>{children}</Web3Context.Provider>
  );
};

export default Web3Provider;
