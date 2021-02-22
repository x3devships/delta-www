import { Button } from '@windmill/react-ui';
import plus from '../../public/plus.svg';

const ConnectWalletButton = ({ onWalletConnect }) => {
  return <Button
    onClick={() => onWalletConnect()}
    className="p-4 mt-4 inline-block text-white uppercase flex ml-2"
    style={{
      marginRight: '1px',
      borderRadius: '0px',
      backgroundColor: 'black',
      padding: '1rem',
      marginTop: '1rem'
    }}
  >
    <span>Connect Wallet</span>
    <img alt="+" src={plus} className="m-auto pl-8" />
  </Button>
}

export default ConnectWalletButton;