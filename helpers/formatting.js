import BigNumber from 'bignumber.js';
import { DATA_UNAVAILABLE } from "../yam/lib/constants";

const getTokenAmount = (amount, decimals = 18, precision = 4) => {
  if (amount === DATA_UNAVAILABLE) {
    return amount;
  }

  if (BigNumber.isBigNumber(amount)) {
    amount = (decimals ? amount.div(new BigNumber(10).pow(decimals)) : amount);
  }

  if (typeof amount === 'string') {
    amount = amount / 10 ** decimals;
  }

  if (precision) {
    amount = parseFloat(amount).toFixed(precision);
  } else {
    amount = parseInt(amount);
  }

  return amount;
};

export default {
  getTokenAmount
};
