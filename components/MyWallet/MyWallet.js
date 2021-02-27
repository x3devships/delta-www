import { useContext } from 'react';
import { DeltaSection, DeltaSectionBlock } from '../Section';
import { formatting } from '../../helpers';
import { GlobalHooksContext } from '../../contexts/GlobalHooks';
import { TokenInput } from "../Input";
import { ModalContext } from '../../contexts';

const MyWallet = () => {
  const globalHooks = useContext(GlobalHooksContext);
  const modalContext = useContext(ModalContext);

  const onStake = async (amount, amountBN, valid) => {
    if (!valid) {
      await modalContext.showError('Error', 'Invalid input');
    } else {
      await modalContext.showConfirm('Staking', `Are you sure you wanna stake ${amount} ? (${amountBN && amountBN.toString()})`);
    }
  };

  return <>
    <DeltaSection requiresConnectedWallet title="My Wallet">
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
    <DeltaSection requiresConnectedWallet title="rLP Stats">
      <DeltaSectionBlock>
        <div className="flex mt-4 md:mt-2 flex-col md:flex-row">
          <div className="mr-4">Total rLP:</div>
          <div>{formatting.getTokenAmount(globalHooks.rlpInfo.balance + globalHooks.staking.rlpStaked, 0, 4)}</div>
        </div>
        <div className="flex mt-4 md:mt-2 flex-col md:flex-row">
          <div className="mr-4">Unstaked rLP:</div>
          <div>{formatting.getTokenAmount(globalHooks.rlpInfo.balance, 0, 4)}</div>
        </div>
        <div className="flex mt-4 md:mt-2 flex-col md:flex-row">
          <div className="mr-4">Staked rLP:</div>
          <div>{formatting.getTokenAmount(globalHooks.staking.rlpStaked, 0, 4)}</div>
        </div>
        <TokenInput className="mt-4" token="delta" buttonText="Stake" buttonTextLoading="Staking..." labelBottom="this token will be staked" onOk={onStake} />
      </DeltaSectionBlock>
    </DeltaSection>
  </>
};

export default MyWallet;
