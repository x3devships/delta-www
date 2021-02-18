import Countdown from 'react-countdown';
import { useLSWStats } from '../../hooks';

const ProgressBarCountDown = () => {
  const second = 1000;
  const minute = second * 60;
  const hour = minute * 60;
  const day = hour * 24;
  const renderer = ({ days, hours, minutes }) => {
    // Render a countdown
    return (
      <span>
        {days} {days > 1 ? 'Days' : 'Day'} {hours} {hours > 1 ? 'Hours' : 'Hour'} {minutes}{' '}
        {minutes > 1 ? 'Minutes' : 'Minute'}
      </span>
    );
  };
  const stats = useLSWStats();
  return (
    <div className="m-auto w-11/12 text-center">
      <div className="border-black border p-2">
        <div className="w-full bg-backgroundLightPurple h-16 w-32">
          <div
            className="bg-backgroundLightPurple bg-gradient-to-r from-gradiantBlue to-gradiantPurple leading-none py-1 h-16 w-32"
            style={{ width: (2 * day * 100) / (Date.now() + 2 * day) }}
          />
        </div>
      </div>
      <div className="mt-8">
        <div className="text-2xl">
          <Countdown date={Date.now() + 2 * day} renderer={renderer} />
        </div>
        <div className="text-xs font-thin">Until Limited Staking Window Is Open</div>
      </div>
    </div>
  );
};

export default ProgressBarCountDown;
