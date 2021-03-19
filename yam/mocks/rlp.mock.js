import BigNumber from 'bignumber.js'

export default {
  methods: {
    balanceOf: (walletAddress) => {
      return {
        call: async () => {
          return 25;
        }
      }
    },

    estimateGas: async () => {
      return BigNumber('345');
    }
  }
}