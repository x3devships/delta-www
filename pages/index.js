import { Hero } from '../components/Hero';
import { Community } from '../components/Community';
import { ReferralProgram } from '../components/ReferralProgram';
import { MainLayout } from '../components/Layout';
import { Vesting } from '../components/Vesting';
import { Vault } from '../components/Vault';
import { Rebase } from '../components/Rebase';
import { LSWStaking } from '../components/LSWStaking';

export default function Main() {
  return <MainLayout>
    <Hero />
    <LSWStaking />
    <ReferralProgram />
    <Vesting />
    <Vault />
    <Rebase />
    <Community />
  </MainLayout>;
}
