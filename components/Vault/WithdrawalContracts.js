import { useContext } from 'react';
import { GlobalHooksContext } from '../../contexts/GlobalHooks';
import { DeltaPanel } from '../Section';

const WithdrawalContractItem = ({ contract }) => {
  return <Delta>
    };

const WithdrawalContracts = () => {
  const globalHooks = useContext(GlobalHooksContext);

  return <DeltaPanel>
      {globalHooks.staking.withdrawalContracts.map((contract, index) => <WithdrawalContractItem key={`contract-${index}`} contract={contract} />)}
    </DeltaPanel>
};
