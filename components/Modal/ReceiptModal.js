import { Modal, ModalHeader, ModalBody, ModalFooter, Button } from '@windmill/react-ui';

const ReceiptModal = ({ title, content, okContent, cancelContent, onOk, onClose, onOpen, contribution }) => {
  return (
    <Modal isOpen={onOpen} onClose={onClose}>
      <ModalHeader>{title}</ModalHeader>
      <ModalBody>
        <div>
          <div className="text-2xl">
            Contribution Amount: <span className="text-green-500">{parseFloat(contribution)}</span>
          </div>
          <div className="text-2xl">
            Bonus: <span className="text-green-500">{content.currentTimeBonus || 0}</span>
          </div>
          <div className="text-2xl">
            Total:<span className="text-green-500">{content.currentTimeBonus || 0 + parseFloat(contribution)}</span>
          </div>
        </div>
      </ModalBody>
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

export default ReceiptModal;
