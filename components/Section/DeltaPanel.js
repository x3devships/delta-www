import { useWallet } from 'use-wallet';
import { ConnectWalletButton } from '../Buttons';

const DeltaPanel = ({ children, className, requiresConnectedWallet }) => {
  const wallet = useWallet();

  const renderContent = () => {
    if (requiresConnectedWallet && !wallet?.account) {
      return <ConnectWalletButton className="mt-4" />
    }

    return children;
  }

  return <div className={`${className || ''} w-full`}>
    {renderContent()}
  </div>;
}

export default DeltaPanel