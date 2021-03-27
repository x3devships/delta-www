import { useEffect, useState } from 'react';
import { useWallet } from 'use-wallet';
import { Yam } from '../../yam';
import YamContext from './YamContext';

const YamProvider = ({ children }) => {
  const { ethereum } = useWallet();
  const [yam, setYam] = useState();

  useEffect(() => {
    if (ethereum) {
      const yam = new Yam(ethereum, {
        defaultAccount: '',
        defaultConfirmations: 1,
        autoGasMultiplier: 1.5,
        testing: false,
        defaultGas: '6000000',
        defaultGasPrice: '1000000000000',
        accounts: [],
        ethereumNodeTimeout: 10000
      });

      yam.initialize().then(() => {
        setYam(yam);
        window.yam = yam;
      });
    }
  }, [ethereum]);

  return <YamContext.Provider value={{ yam }}>{children}</YamContext.Provider>;
};

export default YamProvider;
