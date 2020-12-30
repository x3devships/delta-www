import WalletContext from './WalletContext';
import React from 'react';
import { useWallet } from 'use-wallet';

const CHECK_WALLET_STATUS_REFRESH_RATE = 2 * 1000;

const WalletProvider = ({ children }) => {
  const { account, connector, status, connect } = useWallet();
  const [userAccount, setUserAccount] = React.useState();

  const checkLocalUserAccount = React.useCallback(async () => {
    if (!localStorage.getItem("account")) {
      setUserAccount(null);
    }
  }, []);

  const fetchConnection = React.useCallback(async () => {
    if (status === "disconnected") {
      setUserAccount(null);
      localStorage.removeItem("account");
    }
  }, [status, setUserAccount]);

  React.useEffect(() => {
    checkLocalUserAccount();
    const localAccount = (account ? account.toString() : false) || localStorage.getItem("account");
    if (account) {
      localStorage.setItem("account", localAccount);
      setUserAccount(localAccount);
    }
    if (connector) {
      localStorage.setItem("walletProvider", connector);
    }
  }, [account, userAccount]);

  React.useEffect(() => {
    const checkConnection = setTimeout(() => {
      fetchConnection();
    }, CHECK_WALLET_STATUS_REFRESH_RATE);

    return () => clearTimeout(checkConnection);
  }, [status, fetchConnection]);

  React.useEffect(() => {
    const localAccount = localStorage.getItem("account");
    const walletProvider = localStorage.getItem("walletProvider");
    if (!account && localAccount) {
      setUserAccount(localAccount);
      if (localAccount && (walletProvider === "metamask" || walletProvider === "injected")) {
        handleConnectMetamask();
      }
      if (localAccount && walletProvider === "walletconnect") {
        handleConnectWalletConnect();
      }
    }
  }, []);

  const handleConnectMetamask = React.useCallback(() => {
    connect("injected");
  }, [connect]);

  const handleConnectWalletConnect = React.useCallback(() => {
    connect("walletconnect");
  }, [connect]);

  return <WalletContext.Provider>{children}</WalletContext.Provider>;
};

export default WalletProvider;
