import { ReferralProgram } from '../components/ReferralProgram';
import { MainLayout } from '../components/Layout';
import { MyWallet } from '../components/MyWallet';
import { LSWStaking } from '../components/LSWStaking';
import { HeroIntro } from '../components/HeroIntro';

const Hero = () => {
  return (
    <div className="pt-10 pb-10 mt-3 md:mt-20 text-gray-900 leading-none">
      <div className="text-6xl font-wulkan">
        Delta Has Launched!
      </div>
      <div className="mt-8 text-lg text-left w-full md:w-6/12">
        The Limited Staking Window has successfully come to an end. Delta is now tradable on Uniswap, the rLP tokens are claimable and the Deep Farming Vault is producing yield! Make sure to claim and stake your rLP to earn yield from the Deep Farming Vault.
      </div>
    </div>
  );
};

const DisclaimerFooter = () => <div className="bg-gray-100 font-sm text-gray-900">
  <div className="bg-gray-100 py-4 m-auto" style={{maxWidth:'75ch'}}>
      *APY calculations are based on current DELTA price taken from decentralized exchange prices.
      RLP price used in APY calculations are based on RLP purchase costs from decentralized exchanges. 
      APY of the Deep Farming Vault is not static but its based on vesting interruptions amongst other mechanisms. 
      Deep Farming Vault yield constitutes about 90% DELTA and 10% ETH (in the form of WETH).
  </div>
</div>

export default function Main() {
  return <>
  <MainLayout>
    <Hero />
    <HeroIntro />
    <LSWStaking />
    <ReferralProgram />
    <MyWallet />
  </MainLayout>
  <DisclaimerFooter />
  </>;
}
