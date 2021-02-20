import { useEffect, useState } from 'react';
import useTranslation from 'next-translate/useTranslation';
import { useWallet } from 'use-wallet';
import logo from '../../public/HeaderLogo.svg';

const header = ({ onWalletConnect }) => {
  const wallet = useWallet();
  const [connectWalletVisible, setConnectWalletVisible] = useState(true);
  const { t } = useTranslation('home');
  useEffect(() => {
    if (!wallet.account) {
      setConnectWalletVisible(true);
    } else {
      setConnectWalletVisible(false);
    }
  }, [wallet]);

  return (
    <nav className="flex items-center justify-between flex-wrap bg-black p-6 xs:flex-nowrap">
      <a href="/" className="flex items-center flex-no-shrink text-white mr-6">
        <img src={logo} height="150" width="150" />
      </a>
      <div>
        <button
          onClick={() => (connectWalletVisible ? onWalletConnect() : wallet.reset())}
          className="inline-block text-sm px-4 py-2 leading-none text-white hover:border-transparent mt-4 lg:mt-0 uppercase font-gt_america"
        >
          {connectWalletVisible ? <>{t('connectWallet')}</> : <>{t('disconnect')}</>}
        </button>
      </div>
    </nav>
  );
};

export default header;
