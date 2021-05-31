import { Modal, ModalHeader, ModalBody, ModalFooter, Button } from '@windmill/react-ui';
import { useContext } from 'react';
import { ModalContext } from '../../contexts';
import { ModalType } from '../../contexts/Modal/ModalProvider';

const ConfirmWithBreakdownModal = () => {
  const modalContext = useContext(ModalContext);

  const {
    type,
    title, 
    message,
    breakdown,
    okContent, 
    cancelContent, 
    onOk,
    onClose
  } = modalContext;

  return (
    <Modal
      isOpen={type === ModalType.ConfirmWithBreakdown}
      onClose={onClose}
      style={{
        visibility: type === ModalType.ConfirmWithBreakdown ? 'inherit' : 'hidden',
        borderRadius: '4px'
      }}
    >
      <ModalHeader className="text-2xl font-semibold font-wulkan">{title}</ModalHeader>
      
      <dl className="receipt__list">
        {
         (breakdown || []).map( (x, i) => {
            if ( typeof x === 'function' ) {
              return x(i);
            }
            return <div key={i} className="receipt__list-row">
              <dt className="receipt__item">{x[0]}</dt>
              <dd className="receipt__cost">{x[1]} {x[2]}</dd>
            </div>
          })
        }
      </dl>

      <ModalBody>
        {message}
      </ModalBody>

      <ModalFooter className="sm:p-2">
        <Button className="modal-ok-button w-full sm:w-auto text-white rounded-none py-4" onClick={onOk}>
          {okContent}
        </Button>
        <Button className="modal-cancel-button w-full sm:w-auto text-white rounded-none py-4 s:mb-2" onClick={onClose}>  
          {cancelContent}
        </Button>
      </ModalFooter>
    </Modal>
  );
};

export default ConfirmWithBreakdownModal;