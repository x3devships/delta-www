import BigNumber from 'bignumber.js'

export default {
  methods: {
    estimateGas: async () => {
      return BigNumber('456');
    },

    call: async () => {
      return BigNumber('789');
    },

    send: async () => {
      console.log("Token Mock Received");
    }
  }
}