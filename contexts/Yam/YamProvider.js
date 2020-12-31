import React, { createContext, useEffect, useState } from 'react';
import { useWallet } from 'use-wallet';
import { Yam } from '../../yam';

export const Context = createContext({
  yam: undefined,
});

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
        ethereumNodeTimeout: 10000,
      });
      setYam(yam);

      // Useful for testing using chrome devtools.
      window.yam = yam;
    }
  }, [ethereum]);

  return <Context.Provider value={{ yam }}>{children}</Context.Provider>;
};

export default YamProvider;
