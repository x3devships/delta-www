import BigNumber from 'bignumber.js'

export default {
  methods: {
    totalsForWallet: (accountAddress) => {
      return {
        call: async () => {
          return {
            total: BigNumber('111'),
            mature: BigNumber('222'),
            immature: BigNumber('333')
          }
        }
      }
    },

    vestingTransactions: (accountAddress, i) => {
      return {
        call: async () => {
          return {
            fullVestingTimestamp,
            amount,
            immature,
            mature
          }
        }
      }
    },

    getTransactionDetail: (vestingTransaction) => {
      return {
        call: async () => {
          return {
            fullVestingTimestamp: 5,
            amount: 10,
            immature: 15,
            mature: 20
          }
        }
      }
    },

    estimateGas: async () => {
      return BigNumber('123');
    },

    send: async () => {
      console.log("Delta Mock Received");
    }
  }
}