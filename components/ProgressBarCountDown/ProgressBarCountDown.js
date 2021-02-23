import Countdown from 'react-countdown';

const ProgressBarCountDown = () => {
  const timeStart = 1614011341;
  const timestampEnd = 1614875341;
  const totalSeconds = timestampEnd - timeStart;
  const percentCompletion = ((Date.now() / 1000) - timeStart) / totalSeconds;

  const renderer = ({ days, hours, minutes }) => {
    return (
      <span>
        {days} {days > 1 ? 'Days' : 'Day'} {hours} {hours > 1 ? 'Hours' : 'Hour'} {minutes}{' '}
        {minutes > 1 ? 'Minutes' : 'Minute'}
      </span>
    );
  };

  return (
    <div className="m-auto text-center">
      <div>
        <div className="w-full bg-purple-100 min-h-12 border border-purple-500 p-1">
          <div
            className="bg-purple bg-purple-400 leading-none h-12"
            style={{ width: `${percentCompletion * 100}%` }}
          />
        </div>
      </div>
      <div className="mt-8">
        <div className="text-2xl md:text-xl"><Countdown date={timestampEnd * 1000} renderer={renderer} /></div>
        <div className="text-xs font-thin mt-2">Until Limited Staking Window Is Closed</div>
      </div>
    </div>
  );
};

export default ProgressBarCountDown;
