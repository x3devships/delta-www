import { useEffect, useState } from 'react';

const ProgressBarDiamonds = ({ className, small, value, minValue = 1, maxValue = 10, noUpkeepNeeded }) => {
  const [rightDiamongPositionStyle, setRightDiamongPositionStyle] = useState({});

  !noUpkeepNeeded &&
  useEffect(() => {
    const limitedValue = Math.min(Math.max(minValue, value), maxValue);
    const percent = 1 - (limitedValue / maxValue);

    setRightDiamongPositionStyle({
      marginRight: value < maxValue && value > minValue ? `calc(-1.3rem + ${percent * 100}%)` : '1rem'
    });
  }, [value]);

  const infinite = (
    <svg width="60px" height="28px" viewBox="0 0 60 28" version="1.1">
      <g id="Page-3" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd" strokeLinecap="square">
        <g id="New" transform="translate(-1011.000000, -1294.000000)" stroke="#464647" strokeWidth="5">
          <path d="M1035.56653,1302.07392 C1032.22156,1298.63887 1027.17016,1296.5 1022.54729,1297.36707 C1017.92442,1298.23414 1014.17139,1302.85468 1014.17139,1307.5 C1013.86564,1314.28577 1019.06462,1318.39796 1023.28327,1319.07302 C1025.9506,1319.65247 1028.47258,1319.14229 1031.35111,1317.34521 C1035.48866,1313.58951 1037.99132,1311.449 1040.04253,1309.25275 C1042.04072,1307.11329 1045.40063,1303.51933 1048.28651,1300.94119 C1051.02515,1298.92841 1053.01962,1297.52995 1056.25,1297.5 C1060.19971,1297.51125 1066.43477,1299.07956 1068.08559,1307.5 C1067.40084,1313.00501 1066.49787,1314.02562 1064.6311,1316.16363 C1061.83736,1319.03283 1059.40192,1319.82672 1055.25852,1319.07302 C1052.81213,1318.97286 1049.8259,1317.01018 1046.29984,1313.18496" id="Path-3"></path>
        </g>
      </g>
    </svg>
  );

  return <div className={`m-auto text-center ${className}`}>
    <div className="w-full flex border border-black p-1.5">
      <div className={`flex w-full bg-gradient-to-r from-gradiantGreen1 to-gradiantGreen2 leading-none h-12 ${!small ? 'md:h-16' : ''}`}>
        {!noUpkeepNeeded && [
          <div key={1} className={`ml-3 flex bg-white border border-diamondGreen m-auto transform -rotate-45 min-max-wh-px32 ${!small ? 'md:min-max-wh-px45' : ''} ${value > minValue ? 'hidden' : ''}`}>
            <div className="transform rotate-45 text-xs self-center m-auto">{minValue}x</div>
          </div>,
          <div key={2} className="border-t w-full border-white border-dashed self-center mt-px flex-grow" />,
          <div key={3} className={`flex bg-white border border-diamondGreen m-auto transform -rotate-45 min-max-wh-px32 ${!small ? 'md:min-max-wh-px45' : ''} ${value <= minValue ? 'hidden' : ''}`} style={rightDiamongPositionStyle}>
            <div className="transform rotate-45 text-xs self-center m-auto">{Math.min(Math.max(minValue, value), maxValue)}x</div>
          </div>
        ]}
        {
          noUpkeepNeeded &&
            <div className='progress-infinity-content'>
              {infinite}
              200x
            </div>
        }
      </div>
    </div>
  </div>
};

export default ProgressBarDiamonds;
