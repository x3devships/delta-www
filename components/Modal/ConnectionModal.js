import useTranslation from 'next-translate/useTranslation';
import { Button, Modal, ModalHeader, ModalBody } from '@windmill/react-ui';
import { useWallet } from 'use-wallet';
import { useEffect, useState } from 'react';
import plus from '../../public/plus.svg';
import metaMaskLogo from '../../public/metamask-fox.svg';
import walletConnectLogo from '../../public/wallet-connect.svg';
import metaMask from '../../public/metaMask.png';
import walletConnect from '../../public/walletConnect.png';

const ConnectionModal = ({ closeModal, isModalOpen }) => {
  const wallet = useWallet();
  const { t } = useTranslation('home');
  const [showInstructions, setShowInstructions] = useState(false);
  const [selectMetaMask, setMetaMask] = useState(false);
  useEffect(() => {
    if (wallet.account) {
      if (closeModal) {
        closeModal();
      }
    }
    if (wallet.error) {
      setShowInstructions(true);
    }
  }, [closeModal, wallet]);
  const shutModal = () => {
    closeModal();
    setMetaMask(false);
  };
  return (
    <Modal
      isOpen={isModalOpen}
      onClose={() => {
        shutModal();
      }}
      style={{ borderRadius: '0px', minHeight: '300px' }}
    >
      <ModalHeader className="font-wulkan">{t('connectToDelta')}</ModalHeader>
      <ModalBody>
        <div className="pt-8 m-auto">
          <div className="flex justify-center">
            <Button
              onClick={() => {
                setMetaMask(true);
                wallet.connect();
              }}
              style={{ backgroundColor: 'transparent', color: 'black', fontSize: '16px' }}
            >
              <div className="border-t border-b flex">
                <img src={metaMaskLogo} alt="metamask" className="m-auto pt-2 pb-2 pr-2" />
                <div className="m-auto">{t('metaMask')}</div>
              </div>
            </Button>
          </div>
          {showInstructions && selectMetaMask && (
            <div className="m-auto text-center justify-center">
              <div dangerouslySetInnerHTML={{ __html: t('installMetaMaskInstructions') }} />
              <div>
                <Button
                  className="p-4 mt-4 inline-block text-white uppercase flex ml-2"
                  style={{
                    marginRight: '1px',
                    borderRadius: '0px',
                    backgroundColor: 'black',
                    padding: '1rem',
                    marginTop: '1rem'
                  }}
                >
                  <span>{t('installMetaMask')}</span>
                  <img src={plus} className="m-auto pl-8" />
                </Button>
              </div>
              <div>
                <Button
                  className="p-4 mt-4 inline-block text-white uppercase flex ml-2"
                  style={{
                    marginRight: '1px',
                    borderRadius: '0px',
                    backgroundColor: 'black',
                    padding: '1rem',
                    marginTop: '1rem'
                  }}
                >
                  <span>{t('howToInstall')}</span>
                  <img src={plus} className="m-auto pl-8" />
                </Button>
              </div>
            </div>
          )}
          {!selectMetaMask && (
            <div className="flex justify-center text-black">
              <Button onClick={() => wallet.connect('walletconnect')} style={{ backgroundColor: 'transparent', color: 'black', fontSize: '16px' }}>
                <div className="border-t border-b flex">
                  <img src={walletConnectLogo} alt="walletConnect" className="m-auto border-b pb-2 pt-2 pr-2" style={{ width: '35px', height: '51px' }} />
                  <div className="m-auto">{t('walletConnect')}</div>
                </div>
              </Button>
            </div>
          )}
        </div>
      </ModalBody>
    </Modal>
  );
};

export default ConnectionModal;
