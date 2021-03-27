import BigNumber from 'bignumber.js'

export default {
  methods: {
    getRLPTokenPerEthUnit: (ethValueBN) => {
      return {
        call: async () => {
          return BigNumber('777').toString();
        }
      }
    },

    getLPTokenPerEthUnit: (ethValueBN) => {
      return {
        call: async () => {
          return BigNumber('123').toString();
        }
      }
    },

    addLiquidityBothSides: (deltaValueBN, minLpAmount, autoStake) => {
      return {
        estimateGas: async (transactionParameters) => {
          return BigNumber('234');
        }
      }
    },

    addLiquidityETHOnly: (minLpAmount, autoStake) => {
      return {
        estimateGas: async (transactionParameters) => {
          return BigNumber('345');
        }
      }
    },

    getOptimalEthAmountForDeltaAmount: (deltaAmountBN) => {
      return {
        call: async () => {
          return BigNumber('456');
        }
      }
    },

    getOptimalDeltaAmountForEthAmount: (ethAmountBN) => {
      return {
        call: async () => {
          return BigNumber('567');
        }
      }
    },

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

    rlpPerLP: () => {
      return {
        call: async () => {
          return 12;
        }
      }
    },
  }
}