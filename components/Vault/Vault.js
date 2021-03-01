import { VictoryPie, VictoryLabel, VictoryLegend } from 'victory';
import moment from 'moment';
import { useContext, useEffect, useState } from 'react';
import { Button } from '@windmill/react-ui';
import { DeltaPanel, DeltaSection, DeltaSectionBlock, DeltaSectionBox } from '../Section';
import { DeltaTitleH2, DeltaTitleH3 } from '../Title';
import { formatting } from '../../helpers';
import { ProgressBarDiamonds, VestingTransactionProgressBar } from '../ProgressBar';
import { DATA_UNAVAILABLE } from '../../config';
import { GlobalHooksContext } from '../../contexts/GlobalHooks';
import DeltaButton from '../Button/DeltaButton';
import { TokenInput } from '../Input';
import TransactionButton from '../Button/TransactionButton';
import { ModalContext } from '../../contexts';

const VaultInfoBox = ({ className }) => {
  return <div className={`bg-purpleGray flex flex-row border border-black md:max-h-full md:h-20 ${className}`}>
    <div className="flex border-r border-black flex-col text-center py-1">
      <div className="text-xs px-2 pt-1 pb-2">
        TVL
      </div>
      <div className="text-2xl self-center px-4">
        rLP
      </div>
    </div>
    <div className="flex border-r border-black flex-col text-center flex-grow">
      <div className="text-xs px-2 pt-1 pb-2">
        Amount Staked
      </div>
      <div className="text-2xl self-center px-4 self-end flex flex-grow">
        12,001
      </div>
    </div>
    <div className="flex flex-col text-center">
      <div className="text-xs px-2 pt-1 pb-2">
        Yearly ROI
      </div>
      <div className="text-2xl self-center px-4">
        500%
      </div>
    </div>
  </div >
};

const RLPStats = () => {
  const globalHooks = useContext(GlobalHooksContext);

  return <div className="mt-4 md:mt-0">
    <ul className="list-disc list-inside py-4 md:py-8">
      <li>Staked rLP: {formatting.getTokenAmount(globalHooks.rlpInfo.balance + globalHooks.staking.rlpStaked, 0, 4)} rLP</li>
      <li>Claimable ETH: {formatting.getTokenAmount(globalHooks.rlpInfo.balance, 0, 4)} ETH</li>
      <li>Claimable DELTA: {formatting.getTokenAmount(globalHooks.staking.rlpStaked, 0, 4)} DELTA</li>
    </ul>
    <DeltaButton>See all withdrawal contracts</DeltaButton>
  </div >
};

const DeltaStats = () => {
  const globalHooks = useContext(GlobalHooksContext);

  return <div className="mt-4 md:mt-0">
    <ul className="list-disc list-inside py-4 md:py-8">
      <li>Staked rLP: {formatting.getTokenAmount(globalHooks.rlpInfo.balance + globalHooks.staking.rlpStaked, 0, 4)} rLP</li>
      <li>Claimable ETH: {formatting.getTokenAmount(globalHooks.rlpInfo.balance, 0, 4)} ETH</li>
      <li>Claimable DELTA: {formatting.getTokenAmount(globalHooks.staking.rlpStaked, 0, 4)} DELTA</li>
    </ul>
    <DeltaButton>See all withdrawal contracts</DeltaButton>
  </div >
};

const maxMultipliers = {
  rLP: 30,
  DELTA: 10
};

const TokenVault = ({ token, className }) => {
  const rewardMultiplierDescription = 'Every week 10% of the principle needs to be deposited in the DFV to keep the Multiplier stable';

  return <div className={`mt-4 md:mt-2 ${className}`}>
    <DeltaTitleH2 lineunder>{token} Token</DeltaTitleH2>
    <DeltaPanel className="mt-4 flex flex-col-reverse md:flex-row">
      <div className="flex w-full flex-grow flex-col md:flex-col">
        <VaultInfoBox className="flex flex-stretch mr-0 md:mr-24" />
        <div className="flex w-full flex-col flex-grow mt-4 md:hidden">
          <div className="text-xs flex mb-1">Reward Multiplier</div>
          <ProgressBarDiamonds minMultiplier={1} maxMultiplier={maxMultipliers[token]} className="flex w-full flex-grow" />
          <div className="text-xs text-gray-400 flex mt-1">{rewardMultiplierDescription}</div>
        </div>
        {token === "rLP" ? <DeltaStats /> : <RLPStats />}
      </div>
      <div className="w-full flex-grow hidden flex-col md:flex self-start">
        <ProgressBarDiamonds minMultiplier={1} maxMultiplier={maxMultipliers[token]} className="flex flex-grow w-full" />
        <div className="flex flex-row mt-4">
          <div className="text-xs flex flex-grow w-full">Reward Multiplier</div>
          <div className="text-xs flex text-gray-400">{rewardMultiplierDescription}</div>
        </div>
      </div>
    </DeltaPanel>
  </div>;
};

const Vault = () => {
  const modalContext = useContext(ModalContext);

  return <DeltaSection requiresConnectedWallet title="Delta Farming Vault">
    <DeltaPanel className="md:mt-0">
      <div className="md:mt-0">
        <div className="flex flex-col md:flex-row-reverse">
          <DeltaPanel className="w-full mt-4 mb-4 text-2xl text-semibold text-center w-full pr-0 md:pr-12">
            <div className="border border-black py-2 bg-gray-200 mb-1">Up to 750 % APY*</div>
            <div className="border border-black py-2 bg-gray-200">TVL: $145,223,123</div>
          </DeltaPanel>
          <DeltaPanel className="mt-4 pr-12">
            The Deep Farming Vault distributes<br />
            yield to staked rLP and Delta.
          </DeltaPanel>
        </div>
        <TokenVault token="rLP" />
        <TokenVault token="DELTA" className="mt-8 md:mt-12" />
      </div>
    </DeltaPanel>
  </DeltaSection>;
};


export default Vault;
