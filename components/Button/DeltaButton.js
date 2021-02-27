import { Button, HelperText } from '@windmill/react-ui';
import plus from '../../public/plus.svg';

const DeltaButton = ({ children, className, labelBottom, ...props }) => {
  return <div className={`${className || ''}`}>
    <Button
      className="w-full md:w-max bg-black text-white p-5 rounded-none py-4"
      {...props}
    >
      <div className="text-left flex-grow">
        {children}
      </div>
      <img alt="+" src={plus} className="m-auto ml-0 md:ml-4" />
    </Button>
    <HelperText className={`${!labelBottom ? 'hidden' : ''} text-sm text-left text-gray-500 block mt-0.5`}>{labelBottom}</HelperText>
  </div >
}

export default DeltaButton;