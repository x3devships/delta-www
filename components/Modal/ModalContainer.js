import ConfirmModal from './ConfirmModal';
import ConnectionModal from './ConnectionModal';
import ErrorModal from './ErrorModal';
import MessageModal from './MessageModal';
import ConfirmWithBreakdownModal from './ConfirmWithBreakdownModal';

const ModalContainer = () => {
  return (
    <>
      <ErrorModal />
      <ConfirmModal />
      <MessageModal />
      <ConnectionModal /	>
      <ConfirmWithBreakdownModal />
    </>
  );
};

export default ModalContainer;
