import { InfuraNetwork } from './types';

export const DEFAULT_DERIVATION_PATH = `m/44'/60'/0'/0`;

export const PUBLIC_RPC_PROVIDER_URLS = (network: InfuraNetwork) => {
  switch (network) {
    case InfuraNetwork.Mainnet:
      return [
        `https://mainnet.infura.io/${process.env.INFURA_API_KEY}`,
        `https://pmainnet.infura.io/${process.env.INFURA_API_KEY}`
      ];
    default:
      return [
        `https://${network.toString()}.infura.io/${process.env.INFURA_API_KEY}`
      ];
  }
};