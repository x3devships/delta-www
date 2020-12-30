import React from 'react';
import Web3Context from "./Web3Context";
import { web3Url } from '../../yam/lib/constants';
import { Web3Client } from '../../web3';

const Web3Provider = ({ children }) => {
    const [web3, setWeb3] = React.useState();
  
    React.useEffect(() => {
        const web3 = new Web3Client(web3Url);
        setWeb3(web3);
    }, []);
  
    return <Web3Context.Provider value={{ web3 }}>{children}</Web3Context.Provider>;
  };
  
  export default Web3Provider;