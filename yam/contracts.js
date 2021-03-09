import { addressMap, TEMP_ENABLE_END_LSW_WEB3 } from '../config';
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
import LSW from '../contracts/LSW.json';
import DELTA from '../contracts/DELTA.json';
import RLP from '../contracts/rLP.json';
import DeltaRouter from '../contracts/DeltaRouter.json';

export class Contracts {
  constructor(web3) {
    this.web3 = web3;

    // Uniswap
    this.uniswapRouter = new web3.eth.Contract(UNIRouterJson, addressMap.uniswapRouter);
    this.uniswapFactory = new web3.eth.Contract(UNIFactJson, addressMap.uniswapFactoryV2);

    // Tokens
    this.core = new web3.eth.Contract(CORE.abi, addressMap.core);

    if (TEMP_ENABLE_END_LSW_WEB3) {
      this.delta = new web3.eth.Contract(DELTA.abi, addressMap.delta);
    }

    this.rLP = new web3.eth.Contract(RLP.abi, addressMap.rLP);
    this.wCORE = new web3.eth.Contract(wCORE.abi);
    this.cDAI = new web3.eth.Contract(cDAI.abi, addressMap.cDAI);
    this.wBTC = new web3.eth.Contract(WBTC.abi, addressMap.wBTC);
    this.wETH = new web3.eth.Contract(WETHJson, addressMap.wETH);
    this.cBTC = new web3.eth.Contract(CBTC.abi, addressMap.cBTC);
    this.erc20 = new web3.eth.Contract(ERC20Json.abi);
    this.genericErc20 = new web3.eth.Contract(CORE.abi); // CORE ABI has decimals ERC20 doesn't...

    // Pairs
    this.genericUniswapPair = new web3.eth.Contract(UNIPairJson);
    this.coreCbtcPair = new web3.eth.Contract(UNIPairJson, addressMap.coreCbtc);
    this.coreWethPair = new web3.eth.Contract(UNIPairJson, addressMap.coreWeth);
    this.cDaiWcorePair = new web3.eth.Contract(UNIPairJson, addressMap.cDaiWcore);
    this.wBtcWethPair = new web3.eth.Contract(UNIPairJson, addressMap.wbtcWeth);
    this.ethUsdtPair = new web3.eth.Contract(UNIPairJson, addressMap.ethUsdt);

    // Periphery
    this.LSW = new web3.eth.Contract(LSW.abi, addressMap.LSW);
    this.DeltaRouter = new web3.eth.Contract(DeltaRouter.abi, addressMap.DeltaRouter);
  }
}
