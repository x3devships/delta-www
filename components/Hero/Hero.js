import { useWallet } from 'use-wallet';
import plus from '../../public/plus.svg';

const hero = () => {
  const wallet = useWallet();
  return (
    <div>
      <div className="px-3 md:pl-2 sm:pl-2 lg:2/6 xl:w-2/4 mt-20 lg:mt-40 lg:ml-16 text-left">
        <div className="text-6xl font-semibold text-gray-900 leading-none">
          The Limited Staking <br /> Window is opening soon!
        </div>
        <div className="mt-6 text-xl text-true-gray-500 antialiased font-medium">
          Delta's LSW is starting in the next 48 hours. Early participants can earn up to 30% Bonus rewards. <br />
          Create your Referral Program code to maximize your rewards, and earn ETH for your referrals.
        </div>
        <button
          onClick={() => wallet.connect()}
          className="bg-black shadow-xl p-4 mt-4 inline-block text-white uppercase flex "
        >
          <span>Connect Wallet</span>
          <img src={plus} className="m-auto pl-8" />
        </button>
      </div>
    </div>
  );
};

export default hero;
