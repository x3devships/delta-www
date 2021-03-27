import { useEffect, useState } from 'react';
import DeltaPanel from './DeltaPanel';
import chevron from '../../public/chevron.svg';

const DeltaSectionBox = ({ index, indexFormatter, showIndex, opened, title, className = '', children, onOpen }) => {
  indexFormatter = indexFormatter || (i => i);
  if (opened === undefined) {
    opened = true;
  }

  const [isOpened, setIsOpened] = useState(opened);

  useEffect(() => {
    setIsOpened(opened);
  }, [opened]);

  useEffect(() => {
    if (onOpen && isOpened) {
      onOpen(index);
    }
  }, [isOpened]);

  return <div className={className}>
    <DeltaPanel className="border text-sm border-black">
      <div className="flex flex-row cursor-pointer" onClick={() => setIsOpened(o => !o)} aria-hidden="true">
        {index !== undefined && showIndex && <div className="flex px-4 border-r border-white bg-gray-300 self-stretch">
          <div className="flex self-center">#{indexFormatter(index)}</div>
        </div>}
        <div className="flex flex-grow p-2 md:p-4 bg-gray-300">
          <div className="uppercase flex-grow">{title}</div>
          <img className={`ml-4 self-center ${!isOpened ? 'transform rotate-180' : ''}`} src={chevron} alt="chevron" width="16px" />
        </div>
      </div>
      <div className={`p-1 md:p-4 ${!isOpened ? 'hidden' : ''}`}>
        {children}
      </div>
    </DeltaPanel>
  </div>
};

export default DeltaSectionBox;
