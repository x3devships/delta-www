import { useWallet } from 'use-wallet';
import logo from '../../public/HeaderLogo.svg';

const header = () => {
  const wallet = useWallet();
  return (
    <nav className="flex items-center justify-between flex-wrap bg-black p-6">
      <div className="flex items-center flex-no-shrink text-white mr-6">
        <img src={logo} height="150" width="150" />
      </div>
      <div>
        <button
          onClick={() => wallet.connect()}
          className="inline-block text-sm px-4 py-2 leading-none text-white hover:border-transparent mt-4 lg:mt-0 uppercase"
        >
          Connect Wallet
        </button>
      </div>
    </nav>
  );
};

export default header;
