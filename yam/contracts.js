import { addressMap } from '../config';
import ERC20Json from '../contracts/IERC20.json';
import WETHJson from '../contracts/weth.json';
import UNIFactJson from '../contracts/unifact2.json';
import UNIPairJson from '../contracts/uni2.json';
import UNIRouterJson from '../contracts/uniR.json';
import CORE from '../contracts/CORE.json';
import WBTC from '../contracts/WBTC.json';
import CBTC from '../contracts/cBTC.json';
import cDAI from '../contracts/cDAI.json';
import wCORE from '../contracts/wCORE.json';

export class Contracts {
  constructor(web3) {
    this.web3 = web3;

    // Uniswap
    this.uniswapRouter = new web3.eth.Contract(UNIRouterJson);
    this.uniswapFactory = new web3.eth.Contract(UNIFactJson);

    // Tokens
    this.core = new web3.eth.Contract(CORE.abi);
    this.wCORE = new web3.eth.Contract(wCORE.abi);
    this.cDAI = new web3.eth.Contract(cDAI.abi);
    this.wBTC = new web3.eth.Contract(WBTC.abi);
    this.wETH = new web3.eth.Contract(WETHJson);
    this.cBTC = new web3.eth.Contract(CBTC.abi);
    this.erc20 = new web3.eth.Contract(ERC20Json.abi);
    this.genericErc20 = new web3.eth.Contract(CORE.abi); // CORE ABI has decimals ERC20 doesn't...

    // Pairs
    this.genericUniswapPair = new web3.eth.Contract(UNIPairJson);
    this.coreCbtcPair = new web3.eth.Contract(UNIPairJson);
    this.coreWethPair = new web3.eth.Contract(UNIPairJson);
    this.cDaiWcorePair = new web3.eth.Contract(UNIPairJson);
    this.wBtcWethPair = new web3.eth.Contract(UNIPairJson);
    this.ethUsdtPair = new web3.eth.Contract(UNIPairJson);

    this._updateContractAddresses();
  }

  _updateContractAddresses() {
    // Tokens
    this.wBTC.options.address = addressMap.wBTC;
    this.wETH.options.address = addressMap.wETH;
    this.core.options.address = addressMap.core;
    this.cBTC.options.address = addressMap.cBTC;
    this.cDAI.options.address = addressMap.cDAI;

    // Pairs
    this.uniswapFactory.options.address = addressMap.uniswapFactoryV2;
    this.uniswapRouter.options.address = addressMap.uniswapRouter;
    this.coreCbtcPair.options.address = addressMap.coreCbtc;
    this.coreWethPair.options.address = addressMap.coreWeth;
    this.cDaiWcorePair.options.address = addressMap.cDaiWcore;
    this.wBtcWethPair.options.address = addressMap.wbtcWeth;
    this.ethUsdtPair.options.address = addressMap.ethUsdt;
  }
}
