import { Hero } from '../components/Hero';
import { ReferralProgram } from '../components/ReferralProgram';
import { MainLayout } from '../components/Layout';
import { Vesting } from '../components/Vesting';
import { Rebasing } from '../components/Rebasing';
import { LSWStaking } from '../components/LSWStaking';

export default function Main() {
  return <MainLayout>
    <Hero />
    <LSWStaking />
    <ReferralProgram />
    <Vesting />
    <Rebasing />
  </MainLayout>;
}
