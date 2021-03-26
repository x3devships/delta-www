import BigNumber from 'bignumber.js'

export default {
  methods: {
    setCompundBurn: async (checked) => {
      return checked;
    },

    userInfo: (walletAddress) => {
      return {
        call: async () => {
          return {
            deltaPermanent: BigNumber('111'),
            deltaVesting: BigNumber('222'),
            deltaWithdrawable: BigNumber('333'),
            totalDelta: BigNumber('444'),
            stakedDelta: BigNumber('444'),
            rlp: BigNumber('555'),
            lastBoosterDepositTimestamp: 99999999,
            compoundBurn: true
          }
        }
      }
    },

    realFarmedOfPerson: (walletAddress) => {
      return {
        call: async () => {
          return {
            booster: BigNumber('111'),
            farmedDelta: BigNumber('222'),
            farmedETH: BigNumber('333'),
            recycledDelta: BigNumber('444'),
            recycledETH: BigNumber('555')
          }
        }
      }
    }
  }
}
