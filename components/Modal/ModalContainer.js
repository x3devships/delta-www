import ConfirmModal from './ConfirmModal';
import ConnectionModal from './ConnectionModal';
import ErrorModal from './ErrorModal';
import MessageModal from './MessageModal';

const ModalContainer = () => {
  return (
    <>
      <ErrorModal />
      <ConfirmModal />
      <MessageModal />
      <ConnectionModal />
    </>
  );
};

export default ModalContainer;
