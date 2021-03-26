import { useWallet } from 'use-wallet';
import { useContext, useEffect, useState } from 'react';
import useYam from '../../hooks/useYam';
import { transactions } from '../../helpers';
import { ModalContext } from '../../contexts';
import { DeltaCheckbox } from '.';

const CompoundBurnCheckbox = ({
  className
}) => {
  const yam = useYam();
  const wallet = useWallet();
  const modalContext = useContext(ModalContext);
  const [checked, setChecked] = useState(false);

  const updateCheckedState = async () => {
    const userInfo = await yam.contracts.dfv.methods.userInfo(wallet.account).call();
    console.log(userInfo.compoundBurn);
    setChecked(userInfo.compoundBurn);
  };

  useEffect(() => {
    if (yam) {
      updateCheckedState();
    }
  }, [yam]);

  const onCheckboxChanged = async (event) => {
    const transaction = await yam.contracts.dfv.methods.setCompundBurn(event.target.checked);

    await transactions.executeTransaction(
      modalContext,
      transaction,
      { from: wallet.account },
      'Finished',
      'Success',
      'Error',
      'Transaction'
    );

    updateCheckedState();
  };

  return <div className={className}>
    <div>
      <DeltaCheckbox checked={checked} label="Compound Burn" onChange={onCheckboxChanged} />
    </div>
  </div>
};

export default CompoundBurnCheckbox;
