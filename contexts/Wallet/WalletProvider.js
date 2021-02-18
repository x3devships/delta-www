import { useEffect, useState, useCallback } from 'react';
import { useWallet } from 'use-wallet';
import WalletContext from './WalletContext';

const CHECK_WALLET_STATUS_REFRESH_RATE = 2 * 1000;

const WalletProvider = ({ children }) => {
  const { account, connector, status, connect } = useWallet();
  const [userAccount, setUserAccount] = useState();

  const checkLocalUserAccount = useCallback(async () => {
    if (!localStorage.getItem('account')) {
      setUserAccount(null);
    }
  }, []);

  const fetchConnection = useCallback(async () => {
    console.log(status);
    if (status === 'disconnected') {
      setUserAccount(null);
      localStorage.removeItem('account');
    }
  }, [status, setUserAccount]);

  const handleConnectMetamask = useCallback(() => {
    connect('injected');
  }, [connect]);

  const handleConnectWalletConnect = useCallback(() => {
    connect('walletconnect');
  }, [connect]);

  useEffect(() => {
    checkLocalUserAccount();
    const localAccount = (account ? account.toString() : false) || localStorage.getItem('account');
    if (account) {
      localStorage.setItem('account', localAccount);
      setUserAccount(localAccount);
    }
    if (connector) {
      localStorage.setItem('walletProvider', connector);
    }
  }, [account, userAccount]);

  useEffect(() => {
    const checkConnection = setTimeout(() => {
      fetchConnection();
    }, CHECK_WALLET_STATUS_REFRESH_RATE);

    return () => clearTimeout(checkConnection);
  }, [status, fetchConnection]);

  useEffect(() => {
    const localAccount = localStorage.getItem('account');
    const walletProvider = localStorage.getItem('walletProvider');
    if (!account && localAccount) {
      setUserAccount(localAccount);
      if (localAccount && (walletProvider === 'metamask' || walletProvider === 'injected')) {
        handleConnectMetamask();
      }
      if (localAccount && walletProvider === 'walletconnect') {
        handleConnectWalletConnect();
      }
    }
  }, []);

  return <WalletContext.Provider value={{}}>{children}</WalletContext.Provider>;
};

export default WalletProvider;
