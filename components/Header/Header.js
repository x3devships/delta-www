import { useEffect, useState } from 'react';
import { useWallet } from 'use-wallet';
import logo from '../../public/HeaderLogo.svg';

const header = ({ onWalletConnect }) => {
  const wallet = useWallet();
  const [connectWalletVisible, setConnectWalletVisible] = useState(true);

  useEffect(() => {
    if (!wallet.account) {
      setConnectWalletVisible(true);
    }
  }, [wallet]);

  return (
    <nav className="flex items-center justify-between flex-wrap bg-black p-6">
      <div className="flex items-center flex-no-shrink text-white mr-6">
        <img src={logo} height="150" width="150" />
      </div>
      <div>
        <button
          onClick={() => onWalletConnect()}
          className="inline-block text-sm px-4 py-2 leading-none text-white hover:border-transparent mt-4 lg:mt-0 uppercase"
        >
          {connectWalletVisible ? <>Connect Wallet</> : <></>}
        </button>
      </div>
    </nav>
  );
};

export default header;
