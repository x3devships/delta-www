import BigNumber from 'bignumber.js/bignumber';
import { verifyAddressMap } from '../utils';

BigNumber.config({
  EXPONENTIAL_AT: 1000,
  DECIMAL_PLACES: 80
});

export const SUBTRACT_GAS_LIMIT = 100000;
export const DEFAULT_CONFIRMATIONS = 1;
export const DEFAULT_GAS = '6000000';
export const DEFAULT_GAS_PRICE = '1000000000000';
export const DATA_UNAVAILABLE = '--';

// This provider is no longer working and fails with CORS.
// export const WEB3_PROVIDER_URL = 'https://mainnet.eth.aragon.network/';

// Notes:
// - If one endpoint stop working here is a list of endpoint that can be used: https://ethereumnodes.com/
// - Endpoint found from inspecting XHR request from metamask dev mode in google chrome.Could change in
//   the futur and break: https://mainnet.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161
export const WEB3_PROVIDER_URL = 'https://mainnet.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161';

export const pairNames = {
  deltaWeth: 'deltaWeth',
  coreCbtc: 'coreCbtc',
  coreWeth: 'coreWeth',
  cDaiWcore: 'cDaiWcore',
  ethUsdt: 'ethUsdt',
  wbtcWeth: 'wbtcWeth'
};

export const addressMap = {
  // Uniswap
  uniswapFactory: '0xc0a47dFe034B400B47bDaD5FecDa2621de6c4d95',
  uniswapFactoryV2: '0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f',
  uniswapRouter: '0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D',

  // Pairs
  deltaWeth: '0x169f31b4452aF181Ca8d802cE18b62FCAd8B1b9b',
  coreCbtc: '0x6fad7d44640c5cd0120deec0301e8cf850becb68',
  coreWeth: '0x32ce7e48debdccbfe0cd037cc89526e4382cb81b',
  cDaiWcore: '0x01AC08E821185b6d87E68c67F9dc79A8988688EB',
  ethUsdt: '0x0d4a11d5EEaaC28EC3F61d100daF4d40471f1852',
  wbtcWeth: '0xbb2b8038a1640196fbe3e38816f3e67cba72d940',

  // Tokens
  delta: '0x4326ccFdADCa7d417fd82A0536d86fd77913D472',
  rLP: '0x012819E7Fa602C126B8159330221d8597A450998',
  core: '0x62359ed7505efc61ff1d56fef82158ccaffa23d7',
  wCORE: '0x17b8c1a92b66b1cf3092c5d223cb3a129023b669',
  wETH: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
  wBTC: '0x2260fac5e5542a773aa44fbcfedf7c193bc2c599',
  cBTC: '0x7b5982dcAB054C377517759d0D2a3a5D02615AB8',
  cDAI: '0x00a66189143279b6db9b77294688f47959f37642',

  // Periphery
  LSW: '0xdaFCE5670d3F67da9A3A44FE6bc36992e5E2beaB',
  DeltaRouter: '0xDe4cd518dcd9d9c9D0E44b211548CB9cA1253EB7'
};

export const addressDecimalsMap = {};
addressDecimalsMap[addressMap.wETH] = 18;
addressDecimalsMap[addressMap.core] = 18;
addressDecimalsMap[addressMap.wCORE] = 18;
addressDecimalsMap[addressMap.wbtcWeth] = 18;
addressDecimalsMap[addressMap.wBTC] = 8;
addressDecimalsMap[addressMap.cDAI] = 18;
addressDecimalsMap[addressMap.delta] = 18;

export const tokenMap = {};
tokenMap[addressMap.wETH] = {
  name: 'WETH',
  friendlyName: 'ETH',
  decimals: addressDecimalsMap[addressMap.wETH]
};
tokenMap[addressMap.rLP] = {
  name: 'rLP',
  friendlyName: 'rLP',
  decimals: addressDecimalsMap[addressMap.rLP]
};
tokenMap[addressMap.delta] = {
  name: 'DELTA',
  friendlyName: 'DELTA',
  decimals: addressDecimalsMap[addressMap.delta]
};
tokenMap[addressMap.wBTC] = {
  name: 'WBTC',
  friendlyName: 'BTC',
  decimals: addressDecimalsMap[addressMap.wBTC]
};
tokenMap[addressMap.cBTC] = { name: 'CBTC', ...tokenMap[addressMap.wBTC] };
tokenMap[addressMap.cDAI] = {
  name: 'cDAI',
  friendlyName: 'DAI',
  decimals: addressDecimalsMap[addressMap.cDAI]
};
tokenMap[addressMap.wCORE] = {
  name: 'wCORE',
  friendlyName: 'CORE',
  decimals: addressDecimalsMap[addressMap.wCORE]
};
tokenMap[addressMap.core] = {
  name: 'CORE',
  friendlyName: 'CORE',
  decimals: addressDecimalsMap[addressMap.core]
};
tokenMap[addressMap.wbtcWeth] = {
  name: 'WBTC-WETH LP',
  friendlyName: 'WBTC-WETH LP',
  decimals: addressDecimalsMap[addressMap.wbtcWeth]
};

export const pairInfoMap = {};
pairInfoMap[pairNames.coreWeth] = {
  name: 'CORE/WETH',
  reserve0: tokenMap[addressMap.core],
  reserve1: tokenMap[addressMap.WETH],
  supplyScale: 1,
  unit: 'LP',
  tokenName: 'WETH',
  friendlyTokenName: 'ETH',
  address: addressMap.coreWeth,
  pid: 0
};

export const ethereumStats = {};
ethereumStats.approximatedBlockPerDay = 6650;
ethereumStats.approximatedBlockPerYear = ethereumStats.approximatedBlockPerDay * 365;

// TODO: Enable back
// verifyAddressMap(addressMap);
