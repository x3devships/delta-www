import { useState } from 'react';
import ModalContext from './ModalContext';

export const ModalType = Object.freeze({
  Error: 'error',
  Confirm: 'confirm'
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

  const showError = async (title, content, okContent = 'Ok') => {
    return _showModal(ModalType.Error, { title, content, okContent });
  };

  const showConfirm = async (title, content, okContent = 'Ok', cancelContent = 'Cancel') => {
    return _showModal(ModalType.Confirm, { title, content, okContent, cancelContent });
  };

  return (
    <ModalContext.Provider
      value={{
        ...modal,
        showError,
        showConfirm
      }}
    >
      {children}
    </ModalContext.Provider>
  );
};

export default ModalProvider;
