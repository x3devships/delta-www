import Countdown from 'react-countdown';
import { DATA_UNAVAILABLE } from '../../config';

const ProgressBarCountDown = ({ lswStats }) => {
  const second = 1000;
  const minute = second * 60;
  const hour = minute * 60;
  const day = hour * 24;

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
    <div className="m-auto text-center">
      <div>
        <div className="w-full bg-purple-100 min-h-12 border border-purple-500 p-1">
          <div
            className="bg-purple bg-purple-400 leading-none h-12"
            style={{ width: `${lswStats.data.percentCompletion * 100}%` }}
          />
        </div>
      </div>
      <div className="mt-8">
        <div className="text-2xl md:text-xl">{renderCountdown()}</div>
        <div className="text-xs font-thin mt-2">Until Limited Staking Window Is Closed</div>
      </div>
    </div>
  );
};

export default ProgressBarCountDown;
