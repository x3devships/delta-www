import { useWallet } from 'use-wallet';
import plus from '../../public/plus.svg';
import { useEffect, useState } from 'react';
import Countdown from 'react-countdown';

const hero = () => {
  const wallet = useWallet();
  const [connectWalletVisible, setConnectWalletVisible] = useState(true);
  const renderer = ({ days, hours, minutes, seconds }) => {
    // Render a countdown
    return (
      <span>
        {days} : {hours} : {minutes} : {seconds}
      </span>
    );
  };
  useEffect(() => {
    console.log(wallet.account)
    if (!wallet.account) {
      setConnectWalletVisible(true);
    } else {
      setConnectWalletVisible(false);
    }
  }, [wallet]);

  return (
    <div>
      <div style={{fontFamily:'Wulkan Display'}} className=" flex flex-col justify-cetner text-center px-3 md:pl-2 sm:pl-2 lg:2/6 max-w-6xl mt-20 lg:mt-40 lg:ml-16 text-left">
           Limited Staking Window contributions open <br />
        <div className="text-6xl font-semibold text-gray-900 leading-none">
       
          <Countdown date={1614011400000}  />

        </div>
        <div style={{fontFamily:'Wulkan Display'}} className="mt-6 text-center max-w-xl text-true-gray-500 antialiased self-center pb-10">
          Early participants can earn up to 30% Bonus rewards. <br />
          You can <a className="underline" href="#ref">create</a> your Referral code now to earn ETH for your referrals.
        </div>
       {/* {connectWalletVisible && 
        <button
          onClick={() => wallet.connect()}
          className="bg-black shadow-xl p-4 mt-4 inline-block text-white uppercase flex "
        >
          <span>Connect Wallet</span>
          <img src={plus} className="m-auto pl-8" />
        </button>} */}
      </div>
    </div>
  );
};

export default hero;
