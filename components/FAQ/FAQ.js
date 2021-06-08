import { useContext } from 'react';
import { useWallet } from 'use-wallet';
import { DeltaPanel, DeltaSection } from '../Section';
import { DeltaTitleH2, DeltaTitleH4 } from '../Title';
// import { ProgressBarDiamonds } from '../ProgressBar';
// import { GlobalHooksContext } from '../../contexts/GlobalHooks';
// import { formatting, transactions } from '../../helpers';
import DeltaButton from '../Button/DeltaButton';
import { gitbookUrl } from '../../config';
import { ModalContext } from '../../contexts';

const FAQ = () => {
  const answerStyle = { fontFamily: '"GT America", sans-serif', fontSize: '12pt' };
  return <>
    <DeltaSection title="FAQ">
      <DeltaPanel className="md:mt-0">
        <div className="md:mt-0">
          <DeltaPanel className="my-4 mb-6 text-lg block">
            Here you can find answers to common questions but more information about how DELTA works or how to use the Deep Farming Vault is available at the Document Portal.
            <div className="block md:flex">
              <a target="_blank" href={gitbookUrl} rel="noopener noreferrer">
                <DeltaButton className="mt-4 block md:flex">Delta Document Portal</DeltaButton>
              </a>
            </div>
          </DeltaPanel>

          <DeltaPanel className="mt-8 text-lg block">
            <DeltaTitleH4>What is DELTA used for?</DeltaTitleH4>
            <div style={answerStyle}>
              Delta's open vested liquidity is used for derivative trading on CoreDEX - The DEX beeing build by the core team. <a target="_blank" href="https://medium.com/core-vault/announcing-coredex-318dfc42a67b">Go <u>here</u> to read more about the CoreDEX</a>.
            </div>
          </DeltaPanel>

          <DeltaPanel className="mt-8 text-lg block">
            <DeltaTitleH4>Why has my DELTA or Ethereum rewards not changed for some time?</DeltaTitleH4>
            <div style={answerStyle}>
              The Rewards and the APY depends on how much the DELTA protocol is used. You receive rewards when other users forfeit DELTA and when the system rebases.
            </div>
          </DeltaPanel>

          <DeltaPanel className="mt-8 text-lg block">
            <DeltaTitleH4>How do I increase the reward multiplier?</DeltaTitleH4>
            <div style={answerStyle}>
              The DELTA reward multiplier can be increased by staking or compounding 10% of the staked DELTA principle with burn enabled. By burning 50% of your deposit you will permanently lock the staked DELTA and in turn get rewarded with a increased multiplier.
            </div>
          </DeltaPanel>

          <DeltaPanel className="mt-8 text-lg block">
            <DeltaTitleH4>Why is the APY low?</DeltaTitleH4>
            <div style={answerStyle}>
              Farmers staking rLP and DELTA retrieve rewards as the DELTA eco-system gets used such as parts of forfeit DELTA gets distributed to farmers. Furthermore, DELTA is built as a utility token for decentralised options trading on the CoreDEX, the APY will increase along with the adoption of CoreDEX. Additionally after liquidity pools has been moved to SushiSwap the rebasing functionality is currently not enabled and solutions are beeing researched how to reintroduce it on SushiSwap.
            </div>
          </DeltaPanel>

          <DeltaPanel className="mt-8 text-lg block">
            <DeltaTitleH4>I compounded my DELTA rewards but why does it look like my Ethereum rewards have disappeared?</DeltaTitleH4>
            <div style={answerStyle}>
              Your Ethereum rewards were paid out at the same time you where compounding the DELTA. This is something which is done to save you gas fees.
            </div>
          </DeltaPanel>

          <DeltaPanel className="mt-8 text-lg block">
            <DeltaTitleH4>I bought DELTA on a DEX why is there less DELTA in my wallet than what I bought?</DeltaTitleH4>
            <div style={answerStyle}>
              Delta is vested for 14 days when puchased on a DEX. Furthermore, if you sell the Delta before the 14 day vesting period is over you will forfeit the remaining Delta.
            </div>
          </DeltaPanel>

          <DeltaPanel className="mt-8 text-lg block">
            <DeltaTitleH4>How can I get more rLP?</DeltaTitleH4>
            <div style={answerStyle}>
              You can mint rLP but minting rLP becomes more expensive as time passes after launch of the protocol. RLP can likely be swapped cheaper on SushiSwap/Uniswap but trading of rLP is not supported by community nor the Delta team.
            </div>
          </DeltaPanel>

          <DeltaPanel className="mt-8 text-lg block">
            <DeltaTitleH4>Can I still participate in the LSW to get cheap rLP?</DeltaTitleH4>
            <div style={answerStyle}>
              The LSW phase of the project is over and rLP has to be minted or bought from other users who has participated in the LSW. The DELTA team does not support or facilitate trading of rLP tokens.
            </div>
          </DeltaPanel>

          <DeltaPanel className="mt-8 text-lg block">
            <DeltaTitleH4>I claimed delta rewards but Etherscan.io tell me deposit were called when i inspect the transaction?</DeltaTitleH4>
            <div style={answerStyle}>
              The smart contract function "deposit" in the deep farming vault is used to claim (withdraw) and deposit. When invoked with ZERO amounts of rLP and DELTA to deposit it only claims rewards.
            </div>
          </DeltaPanel>

        </div>
      </DeltaPanel>
    </DeltaSection>
  </>;
};

export default FAQ;