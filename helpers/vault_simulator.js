import BigNumber from 'bignumber.js';

/**
 * The prupose of this helper is to simulate what the DFV is going to do when 
 * depositing / withdrawing / claiming and return
 * information about what repercussion actions have when using the vault
 * interface.
 */

const RLP_RATIO = 200;
const SECONDS_IN_A_DAY = 86400;
const BOOST_DOWN_WEEK = 3;
const BOOST_MAX = 10;
const BOOST_UP_WEEK = 1;

const handleRequire = (expectation, revertMessage) => {
  if (!expectation) {
    throw new Error(revertMessage);
  }
};

const adjustFarmingPowerAndDebt = (newUserInfo, userInfo, vaultInfo, accumulatedDELTAE12, accumulatedETHE12, newBooster) => {
  const newFarmingPower = userInfo.rlp.times(RLP_RATIO).plus(userInfo.totalDelta.times(newBooster));

  vaultInfo.totalFarmingPower = vaultInfo.totalFarmingPower.minus(userInfo.farmingPower).plus(newFarmingPower);

  newUserInfo.farmingPower = newFarmingPower;
  newUserInfo.rewardDebtDELTA = newFarmingPower.times(accumulatedDELTAE12);
  newUserInfo.rewardDebtETH = newFarmingPower.times(accumulatedETHE12);
};

const boostDecayQtyInDuration = (secondsSinceLastBoost) => {
  return secondsSinceLastBoost.div(7 * SECONDS_IN_A_DAY).times(BOOST_DOWN_WEEK);
};

const boosterAfterDuration = (secondsSinceLastBoost, previousBooster) => {
  const boostDecayQty = boostDecayQtyInDuration(secondsSinceLastBoost);

  if (boostDecayQty >= previousBooster) {
    return 1;
  }

  return previousBooster.minus(boostDecayQty);
};

const howMuchOfFarmedPercentIsLegit = (previousBooster, secondsSinceLastBoost) => {
  const oneWeekInSeconds = new BigNumber(7 * SECONDS_IN_A_DAY);

  secondsSinceLastBoost = new BigNumber(secondsSinceLastBoost);
  previousBooster = new BigNumber(previousBooster);

  if (oneWeekInSeconds.gt(secondsSinceLastBoost)) {
    return {
      newBooster: previousBooster,
      percent: 100
    };
  }

  let percent = new BigNumber(0);
  const newBooster = boosterAfterDuration(secondsSinceLastBoost, previousBooster);

  if (newBooster.eq(previousBooster)) {
    return {
      newBooster: previousBooster,
      percent: 100
    };
  }

  let weekNum = new BigNumber(0);
  let accumulatedBoostTimePercentages = new BigNumber(0);

  // eslint-disable-next-line no-constant-condition
  while (true) {
    let thisBooster = new BigNumber(0);
    const jumpDistance = weekNum.times(BOOST_DOWN_WEEK);

    if (previousBooster.lte(jumpDistance.plus(1))) {
      thisBooster = new BigNumber(1);
    } else {
      thisBooster = previousBooster.minus(jumpDistance);
    }

    let secondsThisBooster = oneWeekInSeconds;

    if (weekNum.eq(secondsSinceLastBoost.div(oneWeekInSeconds)) || thisBooster.eq(1)) {
      secondsThisBooster = secondsSinceLastBoost.minus(weekNum.times(oneWeekInSeconds));
      const boosterRatioE2 = thisBooster.times(1e2).div(previousBooster);
      const percentOfTimeSpentInThisBoosterE2 = (new BigNumber(100)).minus(accumulatedBoostTimePercentages);
      percent = percent.plus((new BigNumber(100)).mul(boosterRatioE2).mul(percentOfTimeSpentInThisBoosterE2).div(1e4));
      break;
    } else {
      const percentOfTimeSpentInThisBoosterE2 = secondsThisBooster.mul(1e2).div(secondsSinceLastBoost);
      accumulatedBoostTimePercentages += percentOfTimeSpentInThisBoosterE2;
      const boosterRatioE2 = thisBooster.mul(1e2).div(previousBooster);

      percent = percent.plus((new BigNumber(100)).times(boosterRatioE2).times(percentOfTimeSpentInThisBoosterE2).div(1e4));
    }

    weekNum = weekNum.plus(1);
  }

  handleRequire(percent.lte(100), "DELTA_Deep_Farming_Vault: Percent should never exceed 100%");
  handleRequire(percent.gte(10), "DELTA_Deep_Farming_Vault: Percent should never be lower than 10%");

  return {
    newBooster,
    percent
  };
};

const recycledValuesFromFarmed = (farmedDELTA, farmedETH, percentFarmedWithDELTA, booster, currentTimestamp, lastBoosterDeposit) => {
  const { calculatedBooster, percentLegit } = howMuchOfFarmedPercentIsLegit(booster, currentTimestamp - lastBoosterDeposit);

  return {
    calculatedBooster,
    percentLegit,
    delta: farmedDELTA.times(percentFarmedWithDELTA).times(new BigNumber(100).minus(percentLegit)).div(1e4),
    eth: farmedETH.times(percentFarmedWithDELTA).times(new BigNumber(100).minus(percentLegit)).div(1e4)
  };
};

const adjustFarmedView = (booster, farmedDELTA, farmedETH, lastBoosterDeposit, totalDelta, amountRLP, currentTimestamp) => {
  const farmingPowerRLP = amountRLP.times(RLP_RATIO);
  const farmingPowerDelta = totalDelta.times(booster);
  let percentFarmedWithDELTA = 100;

  if (farmingPowerRLP.gt(0)) {
    percentFarmedWithDELTA = farmingPowerDelta.times(100).div(farmingPowerRLP.plus(farmingPowerDelta));
  }

  if (booster < 2) {
    booster = 1;

    return {
      booster,
      farmedDELTA,
      farmedETH,
      recycledDelta: new BigNumber(0),
      recycledETH: new BigNumber(0)
    };
  }

  if (percentFarmedWithDELTA.gt(0)) {
    const rValues = recycledValuesFromFarmed(farmedDELTA, farmedETH, percentFarmedWithDELTA, booster, currentTimestamp, lastBoosterDeposit);

    if (rValues.calculatedBooster.neq(booster)) {
      booster = rValues.calculatedBooster;
      farmedDELTA = farmedDELTA.minus(rValues.delta);
      farmedETH = farmedETH.minus(rValues.eth);

      return {
        booster,
        farmedDELTA,
        farmedETH,
        recycledDelta: rValues.delta,
        recycledETH: rValues.eth
      };
    }
  }

  return {
    booster,
    farmedDELTA,
    farmedETH,
    recycledDelta: new BigNumber(0),
    recycledETH: new BigNumber(0)
  };
};

const calculateFarmed = (farmingPower, accumulatedDELTAE12, accumulatedETHE12, rewardDebtDELTA, rewardDebtETH) => {
  return {
    farmedDELTA: accumulatedDELTAE12.times(farmingPower).minus(rewardDebtDELTA).div(1e12),
    farmedETH: accumulatedETHE12.times(farmingPower).minus(rewardDebtETH).div(1e12)
  }
};

const _realFarmedOfPerson = (userInfo, accumulatedDELTAE12, accumulatedETHE12, blockTimestamp) => {
  const { totalDELTApreAdjust, totalETHpreAdjust } = calculateFarmed(userInfo.farmingPower, accumulatedDELTAE12, accumulatedETHE12, userInfo.rewardDebtDELTA, userInfo.rewardDebtETH);
  return adjustFarmedView(userInfo.lastBooster, totalDELTApreAdjust, totalETHpreAdjust, userInfo.lastBoosterDepositTimestamp, userInfo.totalDelta, userInfo.rlp, blockTimestamp);
};

const _updateVault = (pendingRewards, vaultInfo, totalFarmingPower) => {
  const pendingDELTA = pendingRewards.DELTA;
  const pendingETH = pendingRewards.ETH;
  let accumulatedDELTAE12 = vaultInfo.accumulatedDELTAPerShareE12;
  let accumulatedETHE12 = vaultInfo.accumulatedETHPerShareE12;

  if (totalFarmingPower.eq(0)) {
    return {
      accumulatedDELTAE12,
      accumulatedETHE12
    };
  }

  if (pendingDELTA.gt(0)) {
    accumulatedDELTAE12 = accumulatedDELTAE12.add(pendingDELTA.mul(1e12).div(totalFarmingPower));
    vaultInfo.accumulatedDELTAPerShareE12 = accumulatedDELTAE12;
  }

  if (pendingETH.gt(0)) {
    accumulatedETHE12 = accumulatedETHE12.add(pendingETH.mul(1e12).div(totalFarmingPower));
    vaultInfo.accumulatedETHPerShareE12 = accumulatedETHE12;
  }

  return {
    accumulatedDELTAE12,
    accumulatedETHE12
  };
};

const recycle = (ri) => {
  const operations = {
    sentETH: new BigNumber(0),
    sentDelta: new BigNumber(0),
  };

  if (ri.recycledETH.gt(0)) {
    operations.sentETH = ri.recycledETH.div(100);
  }

  if (ri.recycledDelta.gt(0)) {
    operations.sentDelta = ri.recycledDelta.div(100);
  }

  return {
    operations,
    booster: ri.booster,
    farmedDELTA: ri.farmedDelta,
    farmedETH: ri.farmedETH
  };
};

const compoundFarmedAndHandleDELTADeposit = (userInfo, newUserInfo, depositDELTA, farmedDELTA, calculatedBooster, isBurn, blockTimestamp) => {
  const operations = {
    burntDelta: new BigNumber(0)
  };

  const burningDeposit = isBurn && depositDELTA.gt(0);
  const compondingBurn = userInfo.compoundBurn && farmedDELTA.gt(0);
  let toBurn = new BigNumber(0);
  let newBooster = calculatedBooster;

  if (burningDeposit) {
    const halfOfDeltaDeposit = depositDELTA.div(2);
    newUserInfo.deltaWithdrawable = userInfo.deltaWithdrawable.add(halfOfDeltaDeposit);
    toBurn = toBurn.add(halfOfDeltaDeposit);
  } else if (depositDELTA > 0) {
    handleRequire(!compondingBurn, "Can not do normal deposits when compoundBurn is on, uncheck it or do a burn deposit");
    newUserInfo.deltaWithdrawable = userInfo.deltaWithdrawable.add(depositDELTA);
    newBooster = 1;
  }

  if (compondingBurn) {
    const halfOfFarmedDelta = farmedDELTA.div(2);
    toBurn = toBurn.add(halfOfFarmedDelta);
    newUserInfo.deltaVesting = userInfo.deltaVesting.add(halfOfFarmedDelta);
  } else if (farmedDELTA > 0) {
    newUserInfo.deltaVesting = userInfo.deltaVesting.add(farmedDELTA);
  }

  if (burningDeposit || compondingBurn) {
    newUserInfo.deltaPermanent = userInfo.deltaPermanent.add(toBurn);
    operations.burntDelta = toBurn;

    if (toBurn.mul(20) >= userInfo.totalDelta && blockTimestamp >= userInfo.lastBoosterDepositTimestamp + (7 * SECONDS_IN_A_DAY)) {
      newUserInfo.lastBoosterDepositTimestamp = blockTimestamp;
      if (blockTimestamp <= userInfo.lastBoosterDepositTimestamp + (14 * SECONDS_IN_A_DAY)) {
        newBooster = newUserInfo.lastBooster + 1;
      } else {
        newBooster += BOOST_UP_WEEK;
      }
    } else if (compondingBurn) {
      handleRequire(blockTimestamp >= userInfo.lastBoosterDepositTimestamp + (14 * SECONDS_IN_A_DAY), "Cannot use compounding burn without getting boost up, uncheck compounding burn, or wait 14 days");
    }

    if (userInfo.lastBoosterDepositTimestamp.eq(0)) {
      handleRequire(userInfo.totalDelta.lte(toBurn), "Uncheck compounding burn, or deposit more. You have to deposit and compound with burn at least 2x your total delta.");
      newBooster = BOOST_MAX;
      newUserInfo.compoundBurn = true;
    }
  }

  userInfo.totalDelta = userInfo.totalDelta.add(depositDELTA).add(farmedDELTA);
  newUserInfo.totalDelta = userInfo.totalDelta;

  if (newBooster > BOOST_MAX) {
    return BOOST_MAX;
  }

  return newBooster;
};

const deposit = (userInfo, vaultInfo, amountRLP, amountDELTA, isBurn) => {
  const newUserInfo = JSON.parse(JSON.stringify(userInfo));
  const operations = {
    sentETH: new BigNumber(0),
    sentDelta: new BigNumber(0),
  };

  const { accumulatedDELTAE12, accumulatedETHE12 } = _updateVault(vaultInfo.totalFarmingPower);
  const ri = _realFarmedOfPerson(userInfo, accumulatedDELTAE12, accumulatedETHE12);

  // eslint-disable-next-line prefer-const
  let { riOperations, newBooster, farmedDELTA, farmedWETH } = recycle(ri);

  operations.sentETH = riOperations.sentETH.plus(riOperations.sentETH);
  operations.sentDelta = riOperations.sentDelta.plus(riOperations.sentDelta);

  newBooster = compoundFarmedAndHandleDELTADeposit(userInfo, newUserInfo, amountDELTA, farmedDELTA, newBooster, isBurn);

  if (farmedWETH > 0) {
    operations.sentEth = farmedWETH;
  }

  if (amountRLP > 0) {
    newUserInfo.rlp = userInfo.rlp.plus(amountRLP);
  }

  newUserInfo.lastBooster = newBooster;
  newUserInfo.totalDelta = userInfo.totalDelta;

  adjustFarmingPowerAndDebt(newUserInfo, userInfo, vaultInfo, accumulatedDELTAE12, accumulatedETHE12, newBooster);

  return {
    newUserInfo,
    operations,
    vaultInfo
  };
};

const withdrawRlp = (userInfo, vaultInfo, amount) => {
  handleRequire(amount > 0, "Cannot withdraw 0 ");
  handleRequire(userInfo.rlp >= amount, "Not enough to withdraw");

  amount = new BigNumber(amount);

  const operations = {
    sentETH: new BigNumber(0),
    sentDelta: new BigNumber(0),
  };

  const newUserInfo = JSON.parse(JSON.stringify(userInfo))

  const { accumulatedDELTAE12, accumulatedETHE12 } = _updateVault(vaultInfo.totalFarmingPower);

  const ri = _realFarmedOfPerson(newUserInfo, accumulatedDELTAE12, accumulatedETHE12);

  // eslint-disable-next-line prefer-const
  let { riOperations, newBooster, farmedDELTA, farmedWETH } = recycle(ri);

  operations.sentETH = riOperations.sentETH.plus(riOperations.sentETH);
  operations.sentDelta = riOperations.sentDelta.plus(riOperations.sentDelta);

  if (farmedWETH > 0) {
    operations.sentEth.plus(farmedWETH);
  }

  if (farmedDELTA > 0) {
    newBooster = compoundFarmedAndHandleDELTADeposit(newUserInfo, userInfo, 0, farmedDELTA, newBooster, false);
  }

  newUserInfo.rlp = newUserInfo.rlp.minus(amount);
  userInfo.rlp = newUserInfo.rlp;
  userInfo.lastBooster = newBooster;

  adjustFarmingPowerAndDebt(userInfo, newUserInfo, accumulatedDELTAE12, accumulatedETHE12, newBooster);
};

const simulateDeposit = async (userInfo, vaultInfo, amountRlp, amountDelta, burningEnabled) => {
  return deposit(userInfo, vaultInfo, amountRlp, amountDelta, burningEnabled);
};

const simulateCompound = async (userInfo, vaultInfo) => {
  return deposit(userInfo, vaultInfo, 0, 0, false);
};

const simulateWithdrawRlp = async (userInfo, amount) => {
  return withdrawRlp(userInfo, amount);
};

export default {
  simulateDeposit,
  simulateCompound,
  simulateWithdrawRlp
};
