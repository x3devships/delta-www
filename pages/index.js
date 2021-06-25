import { ReferralProgram } from '../components/ReferralProgram';
import { MainLayout } from '../components/Layout';
import { MyWallet } from '../components/MyWallet';
import { LSWStaking } from '../components/LSWStaking';
import { HeroIntro } from '../components/HeroIntro';
import { APP_VERSION, deltaSushiswapUrl, oneInchUrl } from '../config';

const Hero = () => {
  return (
    <div className="pt-10 pb-10 mt-3 md:mt-20 text-gray-900 leading-none">
      <div className="text-6xl font-wulkan">
        Delta is live!
      </div>
      <div className="mt-8 text-lg text-left w-full md:w-6/12">
        Delta is live and tradable on <a style={{ color: "purple" }} target="_blank" href={deltaSushiswapUrl} rel="noopener noreferrer">SushiSwap</a> and <a style={{ color: "purple" }} target="_blank" href={oneInchUrl} rel="noopener noreferrer">1Inch</a>. The Deep Farming Vault is producing yield! Make sure to claim rewards and stake your rLP and stake or boost Delta to earn yield from the Deep Farming Vault.
      </div>
    </div>
  );
};

const DisclaimerFooter = () => <div className="bg-gray-100 p-4 text-gray-900 text-sm">
  <div className="m-auto text-justify" style={{ maxWidth: '75ch' }}>
    *APY calculations are based on current DELTA price taken from decentralized exchange prices.
    rLP prices used in APY calculations are based on the rLP costs from decentralized exchanges.
    APY of the Deep Farming Vault is not fixed, but variable based on vesting interruptions and other mechanisms.
    Deep Farming Vault yield constitutes about 90% DELTA and 10% ETH (in the form of WETH).
  </div>
  <div className="text-right text-xs text-gray-500">
    version {APP_VERSION}
  </div>
</div>

export default function Main() {
  return <>
    <MainLayout>
      <Hero />
      <HeroIntro />
      <MyWallet />
      <LSWStaking />
      <ReferralProgram />
    </MainLayout>
    <DisclaimerFooter />
  </>;
}
