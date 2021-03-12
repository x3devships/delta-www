import { Button } from '@windmill/react-ui';
import { useContext } from 'react';
import { ModalContext } from '../../contexts';
import plus from '../../public/plus.svg';

const ConnectWalletButton = ({ className }) => {
  const modalContext = useContext(ModalContext);

  return <div className={className}>
    <Button
      onClick={modalContext.showConnectWallet}
      className="bg-black text-white rounded-none uppercase flex py-4"
    >
      <span>Connect Wallet</span>
      <img alt="+" src={plus} className="m-auto pl-8" />
    </Button>
  </div>
}

export default ConnectWalletButton;