import { useContext } from 'react';
import { DATA_UNAVAILABLE } from '../../config';
import { GlobalHooksContext } from '../../contexts/GlobalHooks';

const Debug = () => {
  const globalHooks = useContext(GlobalHooksContext);

  const renderDate = () => {
    if (globalHooks.blockInfo.block.date !== DATA_UNAVAILABLE) {
      return globalHooks.blockInfo.block.date.utc().format();
    }

    return DATA_UNAVAILABLE;
  };

  return <div className="bg-black p-1 text-green-400 text-xs">
    <ul className="m-2">
      <li> <span className="font-bold">Block # </span>{globalHooks.blockInfo.block.number}</li>
      <li> <span className="font-bold">Timestamp </span>{globalHooks.blockInfo.block.timestamp}</li>
      <li> <span className="font-bold">Date </span>{renderDate()}</li>
    </ul>
  </div>
};

export default Debug;