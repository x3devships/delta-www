import { Input } from '@windmill/react-ui';
import nextId from "react-id-generator";
import { Tooltip } from '../Tooltip';

const DeltaCheckboxButton = ({ text, checked, onChange, tip, className = '' }) => {
  const inputId = nextId();
  return <div className={`flex py-1 bg-lightgray cursor-pointer ${className}`} style={{alignItems: 'center'}}>
    <Input id={inputId} className="cursor-pointer border ml-auto mr-2 border-solid border-black" type="checkbox" checked={checked} onChange={onChange} />
    <label htmlFor={inputId} className="pr-0 pl-0 uppercase select-none cursor-pointer">{text}</label>
    <Tooltip inline tip={tip}/>
  </div>
};

export default DeltaCheckboxButton;
