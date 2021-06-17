import { DeltaPanel, DeltaSection } from '../Section';
import { DeltaTitleH4 } from '../Title';
import DeltaButton from '../Button/DeltaButton';
import { gitbookUrl } from '../../config';

const FAQ = () => {
  const answerStyle = { fontFamily: '"GT America", sans-serif', fontSize: '12pt' };
  return <>
    <DeltaSection title="FAQ">
      <DeltaPanel className="md:mt-0">
        <div className="md:mt-0">
          <DeltaPanel className="my-4 mb-6 text-lg block">
            We put together some commonly asked questions to give you more information about DELTA.
            You can also navigate to the Document Portal where you can find in depth explanations regarding the ecosystem.
            <div className="block md:flex">
              <a target="_blank" href={gitbookUrl} rel="noopener noreferrer">
                <DeltaButton className="mt-4 block md:flex">DELTA Document Portal</DeltaButton>
              </a>
            </div>
          </DeltaPanel>

          <DeltaPanel className="mt-8 text-lg block">
            <DeltaTitleH4>What is DELTA's usecase?</DeltaTitleH4>
            <div style={answerStyle}>
              DELTA has a vesting mechanism built into its token that is triggered on transfer. This Open Vesting Liquidity is useful for onchain options and will be utilized by the upcoming coreDEX. You can read more regarding coreDEX <a href="https://medium.com/core-vault/announcing-coredex-318dfc42a67b">here</a>.</div>
          </DeltaPanel>

          <DeltaPanel className="mt-8 text-lg block">
            <DeltaTitleH4>Why have my DELTA or Ethereum rewards not changed for some time?</DeltaTitleH4>
            <div style={answerStyle}>
              The yield derives from vesting schedule interruptions. If there are no interruptions, no rewards are being generated. The team is
              currently working on releasing guaranteed yield rewards. This will create stable yield for staked rLP and DELTA, regardless of
              vesting schedule interruptions.</div>
          </DeltaPanel>

          <DeltaPanel className="mt-8 text-lg block">
            <DeltaTitleH4>How do I increase the reward multiplier?</DeltaTitleH4>
            <div style={answerStyle}>
              The DELTA reward multiplier can be increased by staking or compounding 10% of the staked DELTA principle with the burn
              function enabled. By burning 50% of your deposit you will permanently lock your staked DELTA and in return get rewarded
              with a increased multiplier.</div>
          </DeltaPanel>

          <DeltaPanel className="mt-8 text-lg block">
            <DeltaTitleH4>Why is the APY low?</DeltaTitleH4>
            <div style={answerStyle}>
              Currently the APY comes exclusively from vesting schedule interruptions. The team is working on launching stable yield for
              rLP and DELTA which will guarantee a minimum amount of yield for staked tokens in the Deep Farming Vault. In the future, the
              protocol will receive more sources of yield from its options layer as well as coreDEX.</div>
          </DeltaPanel>

          <DeltaPanel className="mt-8 text-lg block">
            <DeltaTitleH4>I compounded my DELTA rewards and my Ethereum rewards have disappeared?</DeltaTitleH4>
            <div style={answerStyle}>
              To save on transaction costs, the vault automatically claims your Ethereum rewards when DELTA is compounded.</div>
          </DeltaPanel>

          <DeltaPanel className="mt-8 text-lg block">
            <DeltaTitleH4>I bought DELTA on a DEX why is there less DELTA in my wallet than what I bought?</DeltaTitleH4>
            <div style={answerStyle}>
              DELTA has a vesting schedule which activates on purchase. It will take 14 days to fully mature and reflect the initial purchased
              amount in your wallet. Furthermore, if you sell the DELTA before the 14 day vesting period is over, you will forfeit the remaining
              DELTA.</div>
          </DeltaPanel>

          <DeltaPanel className="mt-8 text-lg block">
            <DeltaTitleH4>How can I get more rLP?</DeltaTitleH4>
            <div style={answerStyle}>
              You can mint new rLP, however the minting process becomes increasingly expensive as time passes. rLP can likely be
              swapped cheaper using a DEX aggregator like 1inch (https://1inch.io/).</div>
          </DeltaPanel>

          <DeltaPanel className="mt-8 text-lg block">
            <DeltaTitleH4>Can I still participate in the LSW to get cheap rLP?</DeltaTitleH4>
            <div style={answerStyle}>
              The LSW is closed. You can buy rLP on different DEX's or mint new tokens on delta.financial.</div>
          </DeltaPanel>

          <DeltaPanel className="mt-8 text-lg block">
            <DeltaTitleH4>I claimed DELTA rewards but Etherscan.io shows that a deposit was made?</DeltaTitleH4>
            <div style={answerStyle}>
              The smart contract function called "deposit" is used to claim (withdraw) and to deposit tokens from the vault. When this
              function is used with ZERO amounts of rLP and DELTA it only claims rewards.</div>
          </DeltaPanel>
        </div>
      </DeltaPanel>
    </DeltaSection>
  </>;
};

export default FAQ;