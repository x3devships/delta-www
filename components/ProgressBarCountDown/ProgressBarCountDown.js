import { useEffect, useMemo } from 'react';
import Countdown from 'react-countdown';
import { DATA_UNAVAILABLE } from '../../config';
import { useLSWStats } from '../../hooks';

const ProgressBarCountDown = () => {
  const second = 1000;
  const minute = second * 60;
  const hour = minute * 60;
  const day = hour * 24;

  const lswStats = useLSWStats();

  useEffect(() => {
    console.log(lswStats);
  }, [lswStats]);

  const renderer = ({ days, hours, minutes }) => {
    return (
      <span>
        {days} {days > 1 ? 'Days' : 'Day'} {hours} {hours > 1 ? 'Hours' : 'Hour'} {minutes}{' '}
        {minutes > 1 ? 'Minutes' : 'Minute'}
      </span>
    );
  };

  const renderCountdown = () => {
    if (lswStats.data.timeEnd !== DATA_UNAVAILABLE) {
      return <Countdown date={lswStats.data.timeEnd * 1000} renderer={renderer} />;
    }

    return <></>;
  };

  return (
    <div className="m-auto w-11/12 text-center">
      <div className="border-black border p-2">
        <div className="w-full bg-backgroundLightPurple h-16 w-32">
          <div
            className="bg-backgroundLightPurple bg-gradient-to-r from-gradiantBlue to-gradiantPurple leading-none py-1 h-16 w-32"
            style={{ width: `${lswStats.data.percentCompletion * 100}%` }}
          />
        </div>
      </div>
      <div className="mt-8">
        <div className="text-2xl">{renderCountdown()}</div>
        <div className="text-xs font-thin">Until Limited Staking Window Is Closed</div>
      </div>
    </div>
  );
};

export default ProgressBarCountDown;
