import { Hero } from '../components/Hero';
import { ReferralProgram } from '../components/ReferralProgram';
import { MainLayout } from '../components/Layout';
import { Vesting } from '../components/Vesting';
import { Vault } from '../components/Vault';
import { Rebasing } from '../components/Rebasing';
import { LSWStaking } from '../components/LSWStaking';

export default function Main() {
  return <MainLayout>
    <Vault />
  </MainLayout>;
}
