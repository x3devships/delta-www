import { useState } from 'react';
import ModalContext from './ModalContext';

export const ModalType = Object.freeze({
  Message: 'message',
  Error: 'error',
  Confirm: 'confirm',
  ConfirmWithBreakdown: 'confirm-with-breakdown',
  ConnectWallet: 'connect-wallet'
});

const ModalProvider = ({ children }) => {
  const [modal, setModal] = useState();

  const _showModal = async (modalType, props) => {
    return new Promise(resolve => {
      setModal({
        ...props,
        type: modalType,
        onOk: () => {
          setModal();
          resolve(true);
        },
        onClose: () => {
          setModal();
          resolve(false);
        }
      });
    });
  };

  const showControlledMessage = (title, content) => {
    const props = { title, content };

    setModal({
      ...props,
      type: ModalType.Message,
      onOk: undefined,
      onClose: () => false,
    });

    return {
      close: () => {
        setModal();
      }
    }
  };

  const showMessage = async (title, content, okContent = 'Ok') => {
    return _showModal(ModalType.Message, { title, content, okContent });
  };

  const showConnectWallet = async () => {
    return _showModal(ModalType.ConnectWallet, {});
  };

  const showError = async (title, content, okContent = 'Ok') => {
    return _showModal(ModalType.Error, { title, content, okContent });
  };

  const showConfirm = async (title, content, okContent = 'Ok', cancelContent = 'Cancel') => {
    return _showModal(ModalType.Confirm, { title, content, okContent, cancelContent });
  };

  const showConfirmWithBreakdown = async (title, message, breakdown, okContent = 'Ok', cancelContent = 'Cancel') => {
    return _showModal(ModalType.ConfirmWithBreakdown, {
      title,
      message,
      breakdown,
      okContent,
      cancelContent
    });
  };

  const closeModal = () => {
    setModal();
  };

  return (
    <ModalContext.Provider
      value={{
        ...modal,
        showMessage,
        showError,
        showConfirm,
        showConfirmWithBreakdown,
        showControlledMessage,
        showConnectWallet,
        closeModal
      }}
    >
      {children}
    </ModalContext.Provider>
  );
};

export default ModalProvider;
