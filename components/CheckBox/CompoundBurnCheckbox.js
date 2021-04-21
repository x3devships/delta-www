import { useWallet } from 'use-wallet';
import { useContext, useEffect, useState } from 'react';
import useYam from '../../hooks/useYam';
import { transactions } from '../../helpers';
import { ModalContext } from '../../contexts';
import { GlobalHooksContext } from '../../contexts/GlobalHooks';
import { Tooltip, Tips } from '../Tooltip'; 

const CompoundBurnCheckbox = ({
  className
}) => {
  const globalHooks = useContext(GlobalHooksContext);
  const yam = useYam();
  const wallet = useWallet();
  const modalContext = useContext(ModalContext);
  const [checked, setChecked] = useState(false);

  const updateCheckedState = async () => {
    const userInfo = await yam.contracts.dfv.methods.userInfo(wallet.account).call();
    setChecked(!!userInfo.compoundBurn);
  };

  useEffect(() => {
    if (yam) {
      updateCheckedState();
    }
  }, [yam, globalHooks.staking.info.compoundBurn]);

  // eslint-disable-next-line consistent-return
  const onCheckboxChanged = async (event) => {
    const { checked } = event.target;
    const transaction = await yam.contracts.dfv.methods.setCompundBurn(event.target.checked);

    const confirm = await modalContext.showConfirm("Compound Burning", `This action is going to ${checked ? 'enable' : 'disable'} automatic compound burning on your next compound deposit and requires to send an Ethereum transaction.`, checked ? 'Enable Compound Burning' : 'Disable Compound Burning');
    if (!confirm) {
      return Promise.resolve();
    }

    await transactions.executeTransaction(
      modalContext,
      transaction,
      { from: wallet.account },
      checked ? "Compound Burning is now enabled" : "Compound Burning is now disabled",
      'Compound Burning',
      'Error',
      "Transaction",
      checked ? "Enabling compound burning..." : "Disabling compound burning..."
    );

    updateCheckedState();
  };

  return <div className={className}>
    <div className="flex items-center w-full">
      <label htmlFor="toogleA" className="flex items-center cursor-pointer">
        <div className="relative">
          <input id="toogleA" type="checkbox" checked={checked} onChange={onCheckboxChanged} className="hidden" />
          <div className="toggle__line w-10 h-4 bg-gray-400 shadow-inner" />
          <div className="toggle__dot border border-gray-400 absolute w-6 h-6 bg-gray-200 shadow inset-y-0 left-0" />
        </div>
        <div className={`ml-3 ${checked ? 'text-black' : 'text-gray-400'} font-medium`}>
          {checked ? 'Compound Burning Enabled' : 'Compound Burning Disabled'}
        </div>
        <Tooltip inline tip={Tips.compoundBurnCheck}/>
      </label>
    </div>
  </div>
};

export default CompoundBurnCheckbox;
