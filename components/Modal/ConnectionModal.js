import useTranslation from 'next-translate/useTranslation';
import { Button, Modal, ModalHeader, ModalBody } from '@windmill/react-ui';
import { useWallet } from 'use-wallet';
import { useEffect, useState } from 'react';
import plus from '../../public/plus.svg';

import metaMask from '../../public/metaMask.svg';
import walletConnect from '../../public/walletConnect.svg';

const ConnectionModal = ({ closeModal, isModalOpen }) => {
  const wallet = useWallet();
  const { t } = useTranslation('home');
  const [showInstructions, setShowInstructions] = useState(false);
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

  return (
    <Modal isOpen={isModalOpen} onClose={closeModal} style={{ borderRadius: '0px', minHeight: '300px' }}>
      <ModalHeader className="font-wulkan">{t('connectToDelta')}</ModalHeader>
      <ModalBody>
        <div className="pt-8 m-auto">
          <div className="flex justify-center">
            <Button onClick={() => wallet.connect()} style={{ backgroundColor: 'transparent' }}>
              <img src={metaMask} alt="metamask" className="m-auto border-t border-b pt-2 pb-2" />
            </Button>
          </div>
          {showInstructions && (
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
          {!showInstructions && (
            <div className="flex justify-center">
              <Button onClick={() => wallet.connect('walletconnect')} style={{ backgroundColor: 'transparent' }}>
                <img src={walletConnect} alt="walletConnect" className="m-auto border-b pb-2 pt-2" />
              </Button>
            </div>
          )}
        </div>
      </ModalBody>
    </Modal>
  );
};

export default ConnectionModal;
