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
import LSW from '../contracts/LSW.json';
import DELTA from '../contracts/DELTA.json';
import RLP from '../contracts/rLP.json';
import DFV from '../contracts/DFV.json';
import DeltaRouter from '../contracts/DeltaRouter.json';
import Withdrawal from '../contracts/Withdrawal.json';
import Distributor from '../contracts/Distributor.json';

export class Contracts {
  constructor(web3) {
    this.web3 = web3;
  }

  async initialize(mocksEnabled = true) {
    this.mocksEnabled = mocksEnabled;
    this.usingMocks = false;

    // Uniswap
    this.uniswapRouter = new this.web3.eth.Contract(UNIRouterJson, addressMap.uniswapRouter);
    this.uniswapFactory = new this.web3.eth.Contract(UNIFactJson, addressMap.uniswapFactoryV2);

    // Tokens
    this.core = new this.web3.eth.Contract(CORE.abi, addressMap.core);

    this.delta = new this.web3.eth.Contract(DELTA.abi, addressMap.delta);
    this.rLP = new this.web3.eth.Contract(RLP.abi, addressMap.rLP);
    this.dfv = new this.web3.eth.Contract(DFV.abi, addressMap.dfv);
    this.distributor = new this.web3.eth.Contract(Distributor.abi, addressMap.distributor);

    // This contract doesn't have a fixed address and
    // getWithdrawalContract() must be used to dynamically get an instance
    // with the right address.
    this._withdrawalContract = new this.web3.eth.Contract(Withdrawal.abi);

    this.wCORE = new this.web3.eth.Contract(wCORE.abi);
    this.cDAI = new this.web3.eth.Contract(cDAI.abi, addressMap.cDAI);
    this.wBTC = new this.web3.eth.Contract(WBTC.abi, addressMap.wBTC);
    this.wETH = new this.web3.eth.Contract(WETHJson, addressMap.wETH);
    this.cBTC = new this.web3.eth.Contract(CBTC.abi, addressMap.cBTC);
    this.erc20 = new this.web3.eth.Contract(ERC20Json.abi);
    this.genericErc20 = new this.web3.eth.Contract(CORE.abi); // CORE ABI has decimals ERC20 doesn't...

    // Pairs
    this.genericUniswapPair = new this.web3.eth.Contract(UNIPairJson);
    this.coreCbtcPair = new this.web3.eth.Contract(UNIPairJson, addressMap.coreCbtc);
    this.coreWethPair = new this.web3.eth.Contract(UNIPairJson, addressMap.coreWeth);
    this.cDaiWcorePair = new this.web3.eth.Contract(UNIPairJson, addressMap.cDaiWcore);
    this.wBtcWethPair = new this.web3.eth.Contract(UNIPairJson, addressMap.wbtcWeth);
    this.ethUsdtPair = new this.web3.eth.Contract(UNIPairJson, addressMap.ethUsdt);

    // Periphery
    this.LSW = new this.web3.eth.Contract(LSW.abi, addressMap.LSW);
    this.deltaRouter = new this.web3.eth.Contract(DeltaRouter.abi, addressMap.deltaRouter);
  }

  getWithdrawalContract(address) {
    return new this.web3.eth.Contract(Withdrawal.abi, address);
  }
}
