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
          const amount = 10;
          const fullVestingTimestamp = 999999;
          
          return (
            amount,
            fullVestingTimestamp
          )
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

    balanceOf: (walletAddress) => {
      return {
        call: async () => {
          return 15;
        }
      }
    }
  }
}