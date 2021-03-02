import useTranslation from 'next-translate/useTranslation';
import { useContext, useState } from 'react';
import { useWallet } from 'use-wallet';
import { useRouter } from 'next/router'
import { ModalContext } from '../../contexts';
import logo from '../../public/HeaderLogo.svg';

const NavBar = () => {
  const wallet = useWallet();
  const modalContext = useContext(ModalContext);
  const { t } = useTranslation('home');
  const [menuVisible, setMenuVisible] = useState(false);
  const router = useRouter()

  const renderMenuItems = () => {
    const getStyle = href => {
      const baseStyle = 'block px-3 py-2 rounded-none text-small font-medium ';

      if (router.pathname === href) {
        return `${baseStyle} bg-gray-700 text-white`;
      }

      return `${baseStyle} text-gray-300 block  hover:text-white hover:bg-gray-700`;
    }
    return <>
      <a href="/" className={getStyle('/')}>Home</a>
      <a href="/vaults" className={getStyle('/vaults')}>Vaults</a>
      <a href="/contracts" className={getStyle('/contracts')}>Withdrawal Contracts</a>
    </>;
  };

  const renderConnectWalletButton = () => {
    return <>
      <button
        type="button"
        onClick={() => {
          if (!wallet?.account) {
            modalContext.showConnectWallet();
          } else {
            wallet.reset();
          }
        }}
        className="uppercase text-gray-300 hover:bg-gray-700 hover:text-white block px-3 py-2 rounded-none text-small font-medium"
      >
        {wallet?.account ? <>{t('disconnect')}</> : <>{t('connectWallet')}</>}
      </button>
    </>
  };

  return (
    <div>
      <nav className="bg-black uppercase">
        <div className="w-full mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <a href="/"><img alt="logo" src={logo} height="150" width="150" className="w-8/12 md:w-full" /></a>
              </div>
              <div className="hidden md:block">
                <div className="ml-10 flex items-baseline space-x-4">
                  {renderMenuItems()}
                </div>
              </div>
            </div>
            <div className="hidden md:block">
              <div className="ml-4 flex items-center md:ml-6">
                <div className="ml-3 relative">
                  {renderConnectWalletButton()}
                </div>
              </div>
            </div>

            <div className="-mr-2 flex md:hidden">
              <button onClick={() => setMenuVisible(m => !m)} type="button" className="bg-black inline-flex items-center justify-center p-2 rounded-none text-gray-400 hover:text-white hover:bg-black focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-black focus:ring-black" aria-controls="mobile-menu" aria-expanded="false">
                <span className="sr-only">Open main menu</span>
                <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
                <svg className="hidden h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        <div className={`md:hidden ${!menuVisible ? 'hidden' : ''}`} id="mobile-menu">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {renderMenuItems()}
          </div>
          <div className="pt-4 pb-3 border-t border-gray-700">
            <div className="flex items-center">
              <div className="ml-2">
                {renderConnectWalletButton()}
              </div>
            </div>
          </div>
        </div>
      </nav>
    </div>
  );
};

export default NavBar;
