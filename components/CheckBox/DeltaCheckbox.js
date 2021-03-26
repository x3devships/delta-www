import { Input } from '@windmill/react-ui';
import nextId from "react-id-generator";

const DeltaCheckbox = ({ label = '', onChange, checked, className = '' }) => {
  const inputId = nextId();

  return <div className={`py-4 bg-lightgray bg-gray-300 cursor-pointer ${className}`}>
    <Input id={inputId} className="cursor-pointer border ml-4 mr-2 border-solid border-black" type="checkbox" checked={checked} onChange={onChange} />
    <label htmlFor={inputId} className="pr-4 uppercase select-none cursor-pointer">{label}</label>
  </div>
}

export default DeltaCheckbox;