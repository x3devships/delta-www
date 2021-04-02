import { useEffect, useState } from 'react';

const ProgressBarDiamonds = ({ className, small, value, minValue = 1, maxValue = 10 }) => {
  const [rightDiamongPositionStyle, setRightDiamongPositionStyle] = useState({});

  useEffect(() => {
    const limitedValue = Math.min(Math.max(minValue, value), maxValue);
    const percent = 1 - (limitedValue / maxValue);

    setRightDiamongPositionStyle({
      marginRight: value < maxValue && value > minValue ? `calc(-1.3rem + ${percent * 100}%)` : '1rem'
    });
  }, [value]);

  return <div className={`m-auto text-center ${className}`}>
    <div className="w-full flex border border-black p-1.5">
      <div className={`flex w-full bg-gradient-to-r from-gradiantGreen1 to-gradiantGreen2 leading-none h-12 ${!small ? 'md:h-16' : ''}`}>
        <div className={`ml-3 flex bg-white border border-diamondGreen m-auto transform -rotate-45 min-max-wh-px32 ${!small ? 'md:min-max-wh-px45' : ''} ${value > minValue ? 'hidden' : ''}`}>
          <div className="transform rotate-45 text-xs self-center m-auto">{minValue}x</div>
        </div>
        <div className="border-t w-full border-white border-dashed self-center mt-px flex-grow" />
        <div className={`flex bg-white border border-diamondGreen m-auto transform -rotate-45 min-max-wh-px32 ${!small ? 'md:min-max-wh-px45' : ''} ${value <= minValue ? 'hidden' : ''}`} style={rightDiamongPositionStyle}>
          <div className="transform rotate-45 text-xs self-center m-auto">{Math.min(Math.max(minValue, value), maxValue)}x</div>
        </div>
      </div>
    </div>
  </div>
};

export default ProgressBarDiamonds;
