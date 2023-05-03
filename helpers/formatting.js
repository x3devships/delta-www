import BigNumber from 'bignumber.js';
import { DATA_UNAVAILABLE } from '../config';

// ND: Introduced this additional method to get the formatted string with the amount since we 
// can have a claimable amount of ETH which is really small and still claimable.
const getTokenAmountAsStrWithMinPrecision = (amount, decimals, precision = 2, maxStringLen = 4) => {
  if (amount === DATA_UNAVAILABLE) {
    return amount;
  }
  if (!BigNumber.isBigNumber(amount)) {
    console.error('getTokenAmountAsStrWithMinPrecision: Error not big number!');
    return amount;
  }
  let ret = '0';
  let lastRealAmt = new BigNumber(ret);
  while (parseFloat(ret) === 0 && precision <= decimals && precision <= maxStringLen) {
    const tenToPowDec = new BigNumber(10).pow(decimals);
    lastRealAmt = amount.div(tenToPowDec);
    ret = Number.parseFloat(lastRealAmt.toString()).toPrecision(precision);
    precision++;
  }
  if (lastRealAmt.gt(0) && lastRealAmt.lt(0.001)) {
    return `< 0.0001`;
  }
  return ret;
};

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
    amount = amount.toLocaleString("en");
  }

  if (Number.isNaN(amount) || (BigNumber.isBigNumber(amount) && amount.isNaN()) || amount === "NaN") {
    return DATA_UNAVAILABLE;
  }

  return parseFloat(amount).toLocaleString("en");
};

const getFormattedFloat = (value, precision = 3) => {
  if (value === DATA_UNAVAILABLE || Number.isNaN(value)) {
    return value;
  }

  return parseFloat(value).toFixed(precision).toLocaleString("en");
}

export default {
  getTokenAmount,
  getFormattedFloat,
  getTokenAmountAsStrWithMinPrecision
};
