import ConfirmModal from './ConfirmModal';
import ErrorModal from './ErrorModal';
import ConnectionModal from './ConnectionModal';

const ModalContainer = () => {
  return (
    <>
      <ConnectionModal />
      <ErrorModal />
      <ConfirmModal />
    </>
  );
};

export default ModalContainer;
