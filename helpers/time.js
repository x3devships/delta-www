import moment from 'moment';

const getTimeLeft = (blockTimestamp, endTimeInSeconds) => {
  if (!blockTimestamp) throw new TypeError('blockTimestamp must be specified');
  if (!endTimeInSeconds) throw new TypeError('endTimeInMillis must be specified');

  const now = moment.utc(blockTimestamp * 1000);
  const fullyVestedAt = moment.utc(endTimeInSeconds * 1000);
  const diffTime = fullyVestedAt - now;
  const duration = moment.duration(diffTime, 'milliseconds');

  return {
    days: duration.days(),
    hours: duration.hours(),
    minutes: duration.minutes()
  }
};

export default {
  getTimeLeft
};
