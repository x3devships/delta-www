/* eslint-disable react/no-danger */
import useTranslation from 'next-translate/useTranslation';
import { Modal, ModalHeader, ModalBody } from '@windmill/react-ui';
import { useWallet } from 'use-wallet';
import { useContext, useEffect, useState } from 'react';
import { isMobile } from 'react-device-detect';
import metaMaskLogo from '../../public/metamask-fox.svg';
import walletConnectLogo from '../../public/wallet-connect.svg';
import { ModalContext } from '../../contexts';
import { ModalType } from '../../contexts/Modal/ModalProvider';

const ConnectionModal = () => {
  const wallet = useWallet();
  const { t } = useTranslation('home');
  const modalContext = useContext(ModalContext);

  const { type, onOk } = modalContext;

  const [showInstructions, setShowInstructions] = useState(false);
  const [connectingToMetaMask, setConnectingToMetaMask] = useState(false);
  const [selectMetaMask, setMetaMask] = useState(false);

  const close = () => {
    onOk();
    setConnectingToMetaMask(false);
    setShowInstructions(false);
    setMetaMask(false);
  };

  useEffect(() => {
    if (type !== ModalType.ConnectWallet) return

    if (wallet.account) {
      close();
    }

    if (wallet.error && connectingToMetaMask) {
      setConnectingToMetaMask(false);
      setShowInstructions(true);
    }
  }, [type, wallet]);

  const renderContent = () => {
    if (connectingToMetaMask) {
      return <div className="text-xl">Connecting...</div>
    }

    return <>
      <div className="flex justify-center">
        <buttton
          onClick={() => {
            setConnectingToMetaMask(true);
            setMetaMask(true);
            wallet.connect();
          }}
          className="text-black text-xl bg-transparent border-t border-b border-gray-400"
        >
          <div className="border-t border-b flex">
            <img src={metaMaskLogo} alt="metamask" className="m-auto pt-2 pb-2 pr-2" />
            <div className="m-auto">{t('metaMask')}</div>
          </div>
        </buttton>
      </div>
      {showInstructions && selectMetaMask && (
        <div className="m-auto text-center justify-center">
          <div className="py-4 text-lg font-bold">
            Connection to MetaMask failed
           </div>
          <div className="py-4 text-justify">
            If you're experiencing issues when connecting your wallet, try the following troubleshooting tips.
          </div>
          <ul className="list-disc list-inside text-left" >
            {isMobile ? <>
              <li>Reload the page</li>
              <li>Be sure to approve the connection</li>
              <li>Connect your wallet using Walletconnect</li>
              <li>Close all apps that might use Walletconnect</li>
              <li>Update Metamask to the latest version</li>
            </> : <>
                <li>Reload the page</li>
                <li>Be sure to approve the connection</li>
                <li>Make sure another wallet is not conflicting with the connection approval</li>
                <li>Connect your wallet using Walletconnect</li>
              </>}
          </ul>
        </div>
      )}
      {!selectMetaMask && (
        <div className="flex justify-center text-black mt-4">
          <buttton onClick={() => wallet.connect('walletconnect')} className="bg-transparent text-black text-xl  border-t border-b border-gray-400">
            <div className="border-t border-b flex">
              <img src={walletConnectLogo} alt="walletConnect" className="m-auto border-b pb-2 pt-2 pr-2" style={{ width: '35px', height: '51px' }} />
              <div className="m-auto">{t('walletConnect')}</div>
            </div>
          </buttton>
        </div>
      )}
    </>
  };


  return (
    <Modal
      isOpen={type === ModalType.ConnectWallet}
      onClose={close}
      style={{
        visibility: type === ModalType.ConnectWallet ? 'inherit' : 'hidden'
      }}
    >
      <ModalHeader><div className="text-2xl font-semibold font-wulkan">{t('connectToDelta')}</div></ModalHeader>
      <ModalBody>
        <div className="pt-8 m-auto text-base">
          {renderContent()}
        </div>
      </ModalBody>
    </Modal>
  );
};

export default ConnectionModal;
