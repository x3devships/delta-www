const Tips = {
  rLPToken: (<span>
    rLP is is the token of the rebasing liquidity pool that serves as part of the deep farming vault. They are minted by locking up ETH and serves as liquidity for the CoreDEX options trading system. Staked rLP will gain a 200x reward multiplier.
  </span>),
  deltaToken: null,
  pendingDelta: null,
  compoundBurnCheck: (<span>
    When Compound burn is enabled, 50% of the compounded DELTA will be locked permanently in the Vault. In return for this DELTA reward multiplier increases or is kept stable.
  </span>),
  burnStakeDeposit: <span>When burn deposit is enabled the deposit to the deep farming vault will be locked and cannot be withdrawn. The burned amount will still be staked and yield rewards.</span>,
  permaLock: <span>The permanently locked DELTA has been staked to maintain DELTA reward multiplier at the expense of locking it forever in the vault. It will keep yielding rewards.</span>,
  deltaCompounded: null,
  immature: (<span>Amount of DELTA which is locked by vesting period. When withdrawing before vesting period is over you will forfeit the immature DELTA.</span>),
  mature: (<span>Amount of DELTA which has been matured during vesting. The mature DELTA can be withdrawn at any given time with the cost of forfeiting the immature DELTA.</span>),
  rLPRewardMultiplier: (<span>The rLP reward multiplier gives you a permanent staking yield boost of 200x without having to maintain the muliplier.</span>),
  deltaRewardMultiplier: (<span>The DELTA reward multipler gives a boost in yield. To keep the reward multiplier high you need to compound deposit 10% DELTA with burn turned on every week.</span>),
  claimEth: (<span>Claimable eth...</span>),
};

export default Tips;
