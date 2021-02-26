import { Button } from '@windmill/react-ui';
import plus from '../../public/plus.svg';

const DeltaButton = ({ children, className, ...props }) => {
  return <Button
    className={`bg-black text-white p-5 rounded-none mt-4 mr-4 py-4 ${className}`}
    {...props}
  >
    {children}
    <img alt="+" src={plus} className="m-auto pl-8" />
  </Button>
}

export default DeltaButton;