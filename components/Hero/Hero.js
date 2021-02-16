import plus from '../../public/plus.svg';

const hero = () => {
  return (
    <div>
      <div className="lg:2/6 xl:w-2/4 mt-20 lg:mt-40 lg:ml-16 text-left">
        <div className="text-6xl font-semibold text-gray-900 leading-none">
          The Limited Staking <br /> Window is open!
        </div>
        <div className="mt-6 text-xl text-true-gray-500 antialiased font-medium">
          Delta's LSW is ongoing. Early participants can earn up to 30% Bonus rewards. <br />
          Make sure to check out our Referral Program to maximize your rewards.
        </div>
        <button className="bg-black shadow-xl p-4 mt-4 inline-block text-white uppercase flex ">
          <span>Connect Wallet</span>
          <img src={plus} className="m-auto pl-8" />
        </button>
      </div>
    </div>
  );
};

export default hero;
