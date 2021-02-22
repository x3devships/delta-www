
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
      <ModalHeader><div className="text-2xl font-semibold font-wulkan">{title}</div></ModalHeader>
      <ModalBody>{content}</ModalBody>
      <ModalFooter>
        <Button className="w-full sm:w-auto text-white" style={{
          marginRight: '1px',
          borderRadius: '0px',
          backgroundColor: 'black',
          padding: '1rem',
          marginTop: '1rem'
        }} onClick={onOk}>
          {okContent}
        </Button>
      </ModalFooter>
    </Modal>
  );
};

export default ErrorModal;