import { Modal, ModalHeader, ModalBody, ModalFooter, Button } from '@windmill/react-ui';

const ErrorModal = ({ title, content, okContent, onOk, onClose, onOpen }) => {
  return (
    <Modal isOpen={onOpen} onClose={onClose}>
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
