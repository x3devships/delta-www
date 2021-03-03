/* eslint-disable react/no-danger */
import { useWallet } from 'use-wallet';
import { useContext, useEffect, useState } from 'react';
import { ProgressBarCountDown } from '../ProgressBar';
import { DeltaPanel, DeltaSection } from '../Section';
import { useYam } from '../../hooks';
import TransactionButton from '../Button/TransactionButton';
import { ModalContext } from '../../contexts';
import { GlobalHooksContext } from '../../contexts/GlobalHooks';
import { DATA_UNAVAILABLE } from '../../config';
import { time } from '../../helpers';

const REFRESH_RATE = 1 * 60 * 1000;

const Rebasing = () => {
  const yam = useYam();
  const globalHooks = useContext(GlobalHooksContext);
  const modalContext = useContext(ModalContext);
  const [timeLeftUntilNextRebase, setTimeLeftUntilNextRebase] = useState({
    days: DATA_UNAVAILABLE,
    hours: DATA_UNAVAILABLE,
    minutes: DATA_UNAVAILABLE
  });

  useEffect(() => {
    const update = () => {
      setTimeLeftUntilNextRebase(time.getTimeLeft(globalHooks.rebasing.rebasingInfo.nextRebaseTimestamp));
    };

    if (globalHooks.rebasing.rebasingInfo.nextRebaseTimestamp !== DATA_UNAVAILABLE) {
      update();
    }

    const interval = setInterval(update, REFRESH_RATE);
    return () => clearInterval(interval);
  }, [globalHooks.rebasing.rebasingInfo.nextRebaseTimestamp]);

  return <DeltaSection requiresConnectedWallet title="Rebasing is Soon">
    <DeltaPanel>
      <ProgressBarCountDown progress={70} />
      <div className="text-center mt-2 md:mt-4 text-lg">{timeLeftUntilNextRebase.days} Day(s) {timeLeftUntilNextRebase.hours} Hour(s) {timeLeftUntilNextRebase.minutes} Minute(s)</div>
    </DeltaPanel>
    <div className="mt-4 md:w-6/12">
      Liquidity Rebasing happens daily,<br />increasing the mint price of rLP by 10%.
    </div>
    {/* TODO: Support for these buttons
    <DeltaPanel className="flex items-center text-center flex-wrap mt-2 md:mt-4">
      <TransactionButton disabled className="flex-1 mr-2 md:mr-0 md:flex-grow-0" text="Mint rLP" textLoading="Minting..." onClick={() => { }} />
      <TransactionButton className="flex-1 ml-2 md:ml-4 md:flex-grow-0" text="Stake rLP" textLoading="Staking..." onClick={() => { }} />
    </DeltaPanel>
    */}
  </DeltaSection >
};

export default Rebasing;
