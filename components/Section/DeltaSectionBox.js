import DeltaPanel from './DeltaPanel';
import chevron from '../../public/chevron.svg';

const DeltaSectionBox = ({ title, className, children }) => {
  return <div className={className}>
    <DeltaPanel className="border text-sm border-black">
      <div className="flex p-2 md:p-4 bg-gray-300">
        <div className="uppercase flex-grow">{title}</div>
        <img className="ml-4 self-center" src={chevron} alt="chevron" width="16px" />
      </div>
      <div className="p-1 md:p-4">
        {children}
      </div>
    </DeltaPanel>
  </div>
};

export default DeltaSectionBox;
