import { Hero } from '../components/Hero';
import { Staking } from '../components/Staking';
import { Community } from '../components/Community';
import { ReferralProgram } from '../components/ReferralProgram';
import { useLSWStats } from '../hooks';
import { MainLayout } from '../components/Layout';
import { Vesting } from '../components/Vesting';

export default function Main() {
  const lswStats = useLSWStats();

  return <MainLayout>
    <Hero />
    <Staking lswStats={lswStats} />
    <ReferralProgram lswStats={lswStats} />
    <Vesting />
    <Community />
  </MainLayout>;
}
