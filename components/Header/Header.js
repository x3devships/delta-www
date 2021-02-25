import useTranslation from 'next-translate/useTranslation';
import { useContext } from 'react';
import { useWallet } from 'use-wallet';
import { ModalContext } from '../../contexts';
import logo from '../../public/HeaderLogo.svg';

const Header = () => {
  const wallet = useWallet();
  const modalContext = useContext(ModalContext);
  const { t } = useTranslation('home');

  return (
    <nav className="flex items-center justify-between flex-wrap bg-black p-3 md:p-6">
      <a href="/" className="flex items-center flex-no-shrink text-white mr-6">
        <img alt="logo" src={logo} height="150" width="150" />
      </a>
      <button
        type="button"
        onClick={() => {
          if (!wallet?.account) {
            modalContext.showConnectWallet();
          } else {
            wallet.reset();
          }
        }}
        className="items-center inline-block text-sm px-4 py-2 leading-none text-white hover:border-transparent lg:mt-0 uppercase self-center"
      >
        {wallet?.account ? <>{t('disconnect')}</> : <>{t('connectWallet')}</>}
      </button>
    </nav>
  );
};

export default Header;
