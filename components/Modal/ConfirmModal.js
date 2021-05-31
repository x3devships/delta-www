import { Modal, ModalHeader, ModalBody, ModalFooter, Button } from '@windmill/react-ui';
import { useContext } from 'react';
import { ModalContext } from '../../contexts';
import { ModalType } from '../../contexts/Modal/ModalProvider';

const ConfirmModal = () => {
  const modalContext = useContext(ModalContext);

  const { type, title, content, okContent, cancelContent, onOk, onClose } = modalContext;

  return (
    <Modal
      isOpen={type === ModalType.Confirm}
      onClose={onClose}
      style={{
        visibility: type === ModalType.Confirm ? 'inherit' : 'hidden',
        borderRadius: '4px'
      }}
    >
      <ModalHeader className="text-2xl font-semibold font-wulkan">{title}</ModalHeader>
      <ModalBody>{content}</ModalBody>
      <ModalFooter className="sm:p-2">
        <Button className="modal-ok-button w-full sm:w-auto text-white rounded-none py-4" onClick={onOk}>
          {okContent}
        </Button>
        <Button className="modal-cancel-button w-full sm:w-auto text-white rounded-none py-4" onClick={onClose}>
          {cancelContent}
        </Button>
      </ModalFooter>
    </Modal>
  );
};

export default ConfirmModal;