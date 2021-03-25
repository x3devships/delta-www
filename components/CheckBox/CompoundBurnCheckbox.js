import { useWallet } from 'use-wallet';
import { useContext } from 'react';
import useYam from '../../hooks/useYam';
import { transactions } from '../../helpers';
import { ModalContext } from '../../contexts';
import { DeltaCheckbox } from '.';

const CompoundBurnCheckbox = ({
  className,
}) => {
  const yam = useYam();
  const wallet = useWallet();
  const modalContext = useContext(ModalContext);

  const onCheckboxChanged = async (event) => {
    const transaction = await yam.contracts.dfv.methods.setCompundBurn(event.target.checked);

    return transactions.executeTransaction(
      modalContext,
      transaction,
      { from: wallet.account },
      'Finished',
      'Success',
      'Error',
      'Transaction'
    );
  };

  return <div className={className}>
    <div>
      <DeltaCheckbox label="Compound Burn" onChange={onCheckboxChanged} />
    </div>
  </div>
};

export default CompoundBurnCheckbox;
