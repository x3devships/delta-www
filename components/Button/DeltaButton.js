import { Button, HelperText } from '@windmill/react-ui';
import plus from '../../public/plus.svg';
import plusGray from '../../public/plus-gray.svg';
import plusBlack from '../../public/plus-black.svg';

const DeltaButton = ({ children, className = '', labelBottom, hidePlus, secondaryLook, grayLook, ...props }) => {
  if (secondaryLook) {
    return <div className={className}>
      <div className="border border-black w-full md:w-max text-black p-0.5">
        <Button
          className="w-full md:w-max bg-gray-300 text-black p-5 rounded-none py-4 flex-grow"
          {...props}
        >
          <div className="text-left flex-grow">
            {children}
          </div>
          {!hidePlus && <img alt="+" src={plusBlack} className="m-auto ml-0 md:ml-4" />}
        </Button>
      </div>
      <HelperText className={`${!labelBottom ? 'hidden' : ''} text-sm text-left text-gray-400 block mt-0.5`}>{labelBottom}</HelperText>
    </div>
  }

  return <div className={className}>
    <Button
      className={`w-full md:w-max ${grayLook ? 'bg-gray-300 text-gray-500' : 'bg-black text-white'} p-5 rounded-none py-4 flex-grow`}
      {...props}
    >
      <div className="text-left flex-grow">
        {children}
      </div>
      {!hidePlus && <img alt="+" src={grayLook ? plusGray : plus} className="m-auto ml-0 md:ml-4" />}
    </Button>
    <HelperText className={`${!labelBottom ? 'hidden' : ''} text-sm text-left text-gray-400 block mt-0.5`}>{labelBottom}</HelperText>
  </div>
}

export default DeltaButton;