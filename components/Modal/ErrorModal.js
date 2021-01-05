import { Modal, ModalHeader, ModalBody, ModalFooter, Button } from '@windmill/react-ui';
import { useContext } from 'react';
import { ModalContext } from '../../contexts';
import { ModalType } from '../../contexts/Modal/ModalProvider';

const ErrorModal = () => {
  const { type, title, content, okContent, onOk, onClose } = useContext(ModalContext);

  return (
    <Modal
      isOpen={type === ModalType.Error}
      onClose={onClose}
      style={{
        visibility: type === ModalType.Error ? 'inherit' : 'hidden'
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

export default ErrorModal;
