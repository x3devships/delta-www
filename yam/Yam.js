import Web3 from 'web3';
import { Contracts } from './contracts';

export class Yam {
  constructor(provider, options) {
    let realProvider;

    if (typeof provider === 'string') {
      if (provider.includes('wss')) {
        realProvider = new Web3.providers.WebsocketProvider(provider, options.ethereumNodeTimeout || 10000);
      } else {
        realProvider = new Web3.providers.HttpProvider(provider, options.ethereumNodeTimeout || 10000);
      }
    } else {
      realProvider = provider;
    }

    this.web3 = new Web3(realProvider);
    this.contracts = new Contracts(this.web3, options);
  }
}
