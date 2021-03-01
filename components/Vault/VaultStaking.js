/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
import { useState } from 'react';
import DeltaButton from '../Button/DeltaButton';
import { DeltaPanel } from '../Section'

const VaultDeposit = ({ token }) => {
  const [toggle, setToggle] = useState(false);

  return <DeltaPanel className="flex items-center text-center flex-wrap">
    <div className="flex border border-black p-1 flex-grow md:flex-none">
      <DeltaButton className="flex-1 mr-2 md:flex-grow-0" onClick={() => setToggle(t => !t)} grayLook={toggle}>Stake</DeltaButton>
      <DeltaButton className="flex-1 md:flex-grow-0" onClick={() => setToggle(t => !t)} grayLook={!toggle}>Buy</DeltaButton>
    </div>
  </DeltaPanel>;
};

const VaultWithdraw = ({ token }) => {
  const [toggle, setToggle] = useState(false);

  return <DeltaPanel className="flex items-center text-center flex-wrap">
    <div className="flex border border-black p-1 flex-grow md:flex-none">
      <DeltaButton className="flex-1 mr-2 md:flex-grow-0" onClick={() => setToggle(t => !t)} grayLook={toggle}>Stake</DeltaButton>
      <DeltaButton className="flex-1 md:flex-grow-0" onClick={() => setToggle(t => !t)} grayLook={!toggle}>Buy</DeltaButton>
    </div>
  </DeltaPanel>;
};

const VaultStaking = ({ token, className }) => {
  const [depositAction, setDepositAction] = useState(true);

  const showAllWithdrawalContracts = () => {
    setDepositAction(false);
  };

  return <DeltaPanel className={`pt-2 border-t-2 border-dashed border-black ${className || ''}`}>
    <div className="flex uppercase" onClick={() => setDepositAction(t => !t)}>
      <div className="flex flex-grow" />
      <div className="flex self-end select-none cursor-pointer text-sm">
        <div className={`${!depositAction ? 'text-gray-300' : 'text-black'}`}>Deposit</div>
        <div className="px-1">/</div>
        <div className={`${depositAction ? 'text-gray-300' : 'text-black'}`}>Withdraw</div>
      </div>
    </div>
    <div className="mt-4 md:mt-1">
      {depositAction ? <VaultDeposit /> : <VaultWithdraw />}
      <DeltaButton className="mt-4" onClick={showAllWithdrawalContracts}>See all withdrawal contracts</DeltaButton>
    </div>
  </DeltaPanel>
};

export default VaultStaking;
