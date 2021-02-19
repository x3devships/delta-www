import { Modal, ModalHeader, ModalBody, ModalFooter, Button } from '@windmill/react-ui';

const ConfirmModal = ({ type, title, content, okContent, cancelContent, onOk, onClose, onOpen }) => {
  return (
    <Modal type={type} isOpen={onOpen} onClose={onClose}>
      <ModalHeader>{title}</ModalHeader>
      <ModalBody>{content}</ModalBody>
      <ModalFooter>
        <Button className="w-full sm:w-auto" layout="outline" onClick={onOk}>
          {okContent}
        </Button>
        <Button className="w-full sm:w-auto" onClick={onClose}>
          {cancelContent}
        </Button>
      </ModalFooter>
    </Modal>
  );
};

export default ConfirmModal;
