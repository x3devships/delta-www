import moment from 'moment';

const getTimeLeft = endTimeInMillis => {
  const now = moment.now();
  const fullyVestedAt = moment(endTimeInMillis);
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
