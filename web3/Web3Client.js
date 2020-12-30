import { Contracts } from "../yam/lib/contracts";
import Web3 from "web3";
import constants from "../constants";

export default class Web3Client {
  constructor(apiUrl, networkId = constants.CHAIN_ID, options) {
    this.web3 = new Web3(apiUrl, networkId);

    const provider = this.web3.eth.currentProvider;
    this.contracts = new Contracts(this.web3, options);
    this.contracts.setContractsProvider(provider, networkId);
  }
}
