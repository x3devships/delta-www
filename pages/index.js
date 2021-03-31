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

export default function Main() {
  return <MainLayout>
    <Hero />
    <HeroIntro />
    <LSWStaking />
    <ReferralProgram />
    <MyWallet />
    {/* <Rebasing /> */}
  </MainLayout>;
}
