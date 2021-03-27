import { MainLayout } from '../components/Layout';
import { Vault } from '../components/Vault';

const Hero = () => {
  return (
    <div className="pt-4 pb-10 mt-4 md:mt-4 text-gray-900 leading-none">
      <div className="text-6xl font-wulkan">
        Deep Farming Vault
      </div>
      <div className="mt-8 text-lg text-left w-full md:w-6/12">
        The Deep Farming Vault distributes<br />
            yield to staked rLP and Delta.
      </div>
    </div>
  );
};

export default function Main() {
  return <MainLayout>

    <Vault />
  </MainLayout>;
}
