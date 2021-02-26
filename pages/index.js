import { Hero } from '../components/Hero';
import { Staking } from '../components/Staking';
import { Community } from '../components/Community';
import { ReferralProgram } from '../components/ReferralProgram';
import { MainLayout } from '../components/Layout';
import { Vesting } from '../components/Vesting';
import { MyWallet } from '../components/MyWallet';

export default function Main() {
  return <MainLayout>
    <Hero />
    <Staking />
    <ReferralProgram />
    <MyWallet />
    <Vesting />
    <Community />
  </MainLayout>;
}
