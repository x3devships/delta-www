import { useWallet } from 'use-wallet';
import { Modal, ModalHeader, ModalBody } from '@windmill/react-ui';
import metaMask from '../../public/metaMask.svg';
import walletConnect from '../../public/walletConnect.svg';

const ConnectionModal = ({ closeModal, isModalOpen }) => {
  const wallet = useWallet();
  return (
    <Modal isOpen={isModalOpen} onClose={closeModal} style={{ borderRadius: '0px', minHeight: '300px' }}>
      <ModalHeader>Connect To Delta</ModalHeader>
      <ModalBody>
        <div className="pt-8">
          <div onClick={() => wallet.connect()}>
            <img src={metaMask} alt="metamask" className="m-auto border-t border-b pt-2 pb-2" />
          </div>
          <div onClick={() => wallet.connect('walletConnect')}>
            <img
              src={walletConnect}
              alt="walletConnect"
              style={{ width: '30%' }}
              className="m-auto border-b pb-2 pt-2"
            />
          </div>
        </div>
      </ModalBody>
    </Modal>
  );
};

export default ConnectionModal;
