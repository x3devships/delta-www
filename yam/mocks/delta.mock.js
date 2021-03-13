import BigNumber from 'bignumber.js'

export default {
  methodToMock: {
    estimateGas: async () => {
      return BigNumber('123');
    },

    call: async () => {
      return BigNumber('456');
    }
  }
}