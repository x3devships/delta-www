import { useContext } from 'react';
import { DeltaSection, DeltaSectionBlock } from '../Section';
import { formatting } from '../../helpers';
import { GlobalHooksContext } from '../../contexts/GlobalHooks';

const MyWallet = () => {
  const globalHooks = useContext(GlobalHooksContext);

  return <DeltaSection requiresConnectedWallet title="My Wallet">
    <DeltaSectionBlock>
      <div className="flex mt-4 md:mt-2 flex-col md:flex-row">
        <div className="mr-4">Total DELTA:</div>
        <div>{formatting.getTokenAmount(globalHooks.delta.data.total, 0, 4)}</div>
      </div>
      <div className="flex mt-4 md:mt-2 flex-col md:flex-row">
        <div className="mr-4">Mature DELTA:</div>
        <div>{formatting.getTokenAmount(globalHooks.delta.data.mature, 0, 4)}</div>
      </div>
      <div className="flex mt-4 md:mt-2 flex-col md:flex-row">
        <div className="mr-4">Immature DELTA:</div>
        <div>{formatting.getTokenAmount(globalHooks.delta.data.immature, 0, 4)}</div>
      </div>
    </DeltaSectionBlock>
  </DeltaSection>
};

export default MyWallet;
