import moment from 'moment';

const getTimeLeft = (blockTimestamp, endTimeInSeconds) => {
  if (!blockTimestamp) throw new TypeError('blockTimestamp must be specified');
  if (!endTimeInSeconds) throw new TypeError('endTimeInMillis must be specified');

  blockTimestamp = parseInt(blockTimestamp);
  endTimeInSeconds = parseInt(endTimeInSeconds);

  const from = moment.utc(blockTimestamp * 1000);
  const to = moment.utc(endTimeInSeconds * 1000);

  // get total seconds between the times
  let delta = Math.abs(endTimeInSeconds - blockTimestamp);

  // calculate (and subtract) whole days
  const days = Math.floor(delta / 86400);
  delta -= days * 86400;

  // calculate (and subtract) whole hours
  const hours = Math.floor(delta / 3600) % 24;
  delta -= hours * 3600;

  // calculate (and subtract) whole minutes
  const minutes = Math.floor(delta / 60) % 60;
  delta -= minutes * 60;

  // what's left is seconds
  const seconds = delta % 60;  // in theory the modulus is not required

  return {
    days,
    hours,
    minutes,
    seconds,
    toNow: from.to(to)
  }
};

export default {
  getTimeLeft
};
