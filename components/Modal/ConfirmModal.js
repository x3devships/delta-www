import { Modal, ModalHeader, ModalBody, ModalFooter, Button } from '@windmill/react-ui';
import { useContext } from 'react';
import { ModalContext } from '../../contexts';
import { ModalType } from '../../contexts/Modal/ModalProvider';

const ConfirmModal = () => {
  const modalContext = useContext(ModalContext);

  const { type, title, content, okContent, cancelContent, onOk, onClose } = modalContext;

  return (
    <Modal
      type={type}
      isOpen={type === ModalType.Confirm}
      onClose={onClose}
      style={{
        visibility: type === ModalType.Confirm ? 'inherit' : 'hidden'
      }}
    >
      <ModalHeader>{title}</ModalHeader>
      <ModalBody>{content}</ModalBody>
      <ModalFooter>
        <Button className="w-full sm:w-auto" style={{
          marginRight: '1px',
          borderRadius: '0px',
          backgroundColor: 'black',
          padding: '1rem',
          marginTop: '1rem'
        }} onClick={onOk}>
          {okContent}
        </Button>
        <Button style={{
          marginRight: '1px',
          borderRadius: '0px',
          backgroundColor: 'black',
          padding: '1rem',
          marginTop: '1rem'
        }} className="w-full sm:w-auto" onClick={onClose}>
          {cancelContent}
        </Button>
      </ModalFooter>
    </Modal>
  );
};

export default ConfirmModal;