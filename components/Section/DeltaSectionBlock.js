import { useWallet } from 'use-wallet';
import { ConnectWalletButton } from '../Buttons';

const DeltaSectionBlock = ({ children, requiresConnectedWallet, className }) => {
  const wallet = useWallet();

  const renderContent = () => {
    if (requiresConnectedWallet && !wallet?.account) {
      return <ConnectWalletButton />
    }
    return children;
  }

  return <section className={className}>
    <div className="w-full border-0 border-gray-400 border-t mt-4 pt-4 border-black m-auto">
      {renderContent()}
    </div>
  </section>;
};

export default DeltaSectionBlock