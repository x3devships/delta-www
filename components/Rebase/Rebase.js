/* eslint-disable react/no-danger */
import { useWallet } from 'use-wallet';
import { useContext } from 'react';
import { ProgressBarCountDown } from '../ProgressBar';
import { DeltaPanel, DeltaSection } from '../Section';
import { useYam } from '../../hooks';
import TransactionButton from '../Button/TransactionButton';
import { ModalContext } from '../../contexts';
import { GlobalHooksContext } from '../../contexts/GlobalHooks';

const Rebase = () => {
  const yam = useYam();
  const globalHooks = useContext(GlobalHooksContext);
  const modalContext = useContext(ModalContext);

  return <DeltaSection requiresConnectedWallet title="Rebasing is Soon">
    <DeltaPanel>
      <ProgressBarCountDown progress={70} />
      <div className="text-center mt-2 md:mt-4 text-lg">2 Day(s) 5 Hour(s) 33 Minute(s)</div>
    </DeltaPanel>
    <div className="mt-4 md:w-6/12">
      Liquidity Rebasing happens daily,<br />increasing the mint price of rLP by 10%.
    </div>
    <DeltaPanel className="flex items-center text-center flex-wrap mt-2 md:mt-4">
      <TransactionButton className="flex-1 mr-2 md:mr-0 md:flex-grow-0" text="Mint rLP" textLoading="Minting..." onClick={() => { }} />
      <TransactionButton className="flex-1 ml-2 md:ml-4 md:flex-grow-0" text="Stake rLP" textLoading="Staking..." onClick={() => { }} />
    </DeltaPanel>
  </DeltaSection >
};

export default Rebase;
