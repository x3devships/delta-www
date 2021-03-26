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

    allowance: (walletAddress, contractAddress) => {
      return {
        call: async () => {
          return 77;
        }
      }
    },

    estimateGas: async () => {
      return BigNumber('345');
    }
  }
}