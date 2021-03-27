import BigNumber from 'bignumber.js';
import { ethers } from 'ethers';

const parseFloatToBigNumber = (amount, decimals = 18) => {
  try {
    const value = new BigNumber(ethers.utils.parseUnits(amount.toString(), decimals).toString());
    // We can't never be too sure.
    if (BigNumber.isBigNumber(value)) {
      return value;
    }
  } catch {
    // ignored
  }

  return NaN;
};

export default {
  parseFloatToBigNumber
};
