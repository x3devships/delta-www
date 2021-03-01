/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
import { useState } from 'react';
import DeltaButton from '../Button/DeltaButton';
import { DeltaPanel } from '../Section'

const VaultDeposit = () => {
  const [toggle, setToggle] = useState(false);

  return <div className="flex flex-grow">
    <div className="border border-black p-1 flex flex-row">
      <DeltaButton onClick={() => setToggle(t => !t)} grayLook={toggle}>Stake</DeltaButton>
      <DeltaButton onClick={() => setToggle(t => !t)} grayLook={!toggle}>Buy</DeltaButton>
    </div>
  </div>;
};

const VaultWithdraw = () => {
  const [toggle, setToggle] = useState(false);

  return <div className="flex flex-grow">
    <div className="border border-black p-1 flex flex-row">
      <DeltaButton onClick={() => setToggle(t => !t)} grayLook={toggle}>Stake</DeltaButton>
      <DeltaButton onClick={() => setToggle(t => !t)} grayLook={!toggle}>Buy</DeltaButton>
      <DeltaButton onClick={() => setToggle(t => !t)} grayLook={!toggle}>Buy</DeltaButton>
      <DeltaButton onClick={() => setToggle(t => !t)} grayLook={!toggle}>Buy</DeltaButton>
    </div>
  </div>;
};

const VaultStaking = ({ token, className }) => {
  const [toggle, setToggle] = useState(false);

  return <DeltaPanel className={`pt-1 border-t-2 border-dashed border-black ${className || ''}`}>
    <div className="flex uppercase" onClick={() => setToggle(t => !t)}>
      <div className="flex flex-grow" />
      <div className="flex self-end select-none cursor-pointer text-sm">
        <div className={`${toggle ? 'text-gray-300' : 'text-black'}`}>Deposit</div>
        <div className="px-1">/</div>
        <div className={`${!toggle ? 'text-gray-300' : 'text-black'}`}>Withdraw</div>
      </div>
    </div>
    <div className="mt-4 md:mt-1">
      {toggle ? <VaultWithdraw /> : <VaultDeposit />}
      {/* <DeltaButton>See all withdrawal contracts</DeltaButton> */}
    </div>
  </DeltaPanel>
};

export default VaultStaking;
