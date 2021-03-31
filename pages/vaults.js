import { MainLayout } from '../components/Layout';
import { Vault } from '../components/Vault';
import { ApyDisplay } from '../components/Apy';

export default function Main() {
  return <MainLayout>
    <ApyDisplay />
    <Vault />
  </MainLayout>;
}
