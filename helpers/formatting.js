import BigNumber from 'bignumber.js';
import { DATA_UNAVAILABLE } from '../config';

const getTokenAmount = (amount, decimals = 18, precision = 4, toLocaleString = true) => {
  if (amount === DATA_UNAVAILABLE) {
    return amount;
  }

  if (BigNumber.isBigNumber(amount)) {
    amount = decimals ? amount.div(new BigNumber(10).pow(decimals)) : amount;
  }

  if (typeof amount === 'string') {
    amount /= 10 ** decimals;
  }

  if (precision) {
    amount = parseFloat(amount).toFixed(precision);
  } else {
    amount = parseInt(amount);
  }

  if (toLocaleString) {
    amount = amount.toLocaleString();
  }

  if (Number.isNaN(amount)) {
    return DATA_UNAVAILABLE;
  }

  return amount
};

export default {
  getTokenAmount
};
