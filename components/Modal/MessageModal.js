
import { Modal, ModalHeader, ModalBody, ModalFooter, Button } from '@windmill/react-ui';
import { useContext } from 'react';
import { ModalContext } from '../../contexts';
import { ModalType } from '../../contexts/Modal/ModalProvider';

const MessageModal = () => {
  const { type, title, content, okContent, onOk, onClose } = useContext(ModalContext);

  return (
    <Modal
      isOpen={type === ModalType.Message}
      onClose={onClose}
      style={{
        visibility: type === ModalType.Message ? 'inherit' : 'hidden'
      }}
    >
      <ModalHeader>{title}</ModalHeader>
      <ModalBody>{content}</ModalBody>
      <ModalFooter>
        <Button className="w-full sm:w-auto" onClick={onOk}>
          {okContent}
        </Button>
      </ModalFooter>
    </Modal>
  );
};

export default MessageModal;