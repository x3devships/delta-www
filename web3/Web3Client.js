import Web3 from 'web3';
import { Contracts } from '../yam/contracts';

export default class Web3Client {
  constructor(apiUrl, options) {
    this.web3 = new Web3(apiUrl);
    this.contracts = new Contracts(this.web3, options);
  }

  async initialize() {
    return this.contracts.initialize(true);
  }
}
