import BigNumber from 'bignumber.js'

export default {
  methods: {
    estimateGas: async () => {
      return BigNumber('345');
    },

    call: async () => {
      return BigNumber('678');
    },

    send: async () => {
      console.log("Rlp Mock Received");
    }
  }
}