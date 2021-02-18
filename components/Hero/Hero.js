import { useWallet } from 'use-wallet';
import { useEffect, useState } from 'react';
import plus from '../../public/plus.svg';

const hero = () => {
  const wallet = useWallet();
  const [connectWalletVisible, setConnectWalletVisible] = useState(true);

  useEffect(() => {
    console.log(wallet.account);
    if (!wallet.account) {
      setConnectWalletVisible(true);
    } else {
      setConnectWalletVisible(false);
    }
  }, [wallet]);

  return (
    <div>
      <div className="px-3 md:pl-2 sm:pl-2 lg:2/6 xl:w-2/4 mt-20 lg:mt-40 lg:ml-16 text-left">
        <div className="text-6xl font-semibold text-gray-900 leading-none font-wulkan">
          The Limited Staking <br /> Window is opening soon!
        </div>
        <div className="mt-6 text-xl text-true-gray-500 antialiased font-gt_americare">
          Delta's LSW is starting in the next 48 hours. Early participants can earn up to 30% Bonus rewards. <br />
          You'll be able to create your Referral Program code to maximize your rewards shortly. This will enable you to
          earn ETH for your referrals.
        </div>
        {connectWalletVisible && (
          <button
            onClick={() => wallet.connect()}
            className="bg-black shadow-xl p-4 mt-4 inline-block text-white uppercase flex font-gt_americare"
          >
            <span>Connect Wallet</span>
            <img src={plus} className="m-auto pl-8" />
          </button>
        )}
      </div>
    </div>
  );
};

export default hero;
