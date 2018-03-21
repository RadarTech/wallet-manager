import { InfuraNetwork, RpcConnection } from './types';

export const DEFAULT_DERIVATION_PATH = `m/44'/60'/0'/0`;

export const PUBLIC_RPC_PROVIDER_URLS = (connection: RpcConnection) => {
  switch (connection) {
    case InfuraNetwork.Mainnet:
      return [
        `https://mainnet.infura.io/${process.env.INFURA_API_KEY}`,
        `https://pmainnet.infura.io/${process.env.INFURA_API_KEY}`
      ];
    case InfuraNetwork.Kovan:
    case InfuraNetwork.Rinkeby:
    case InfuraNetwork.Ropsten:
      return [
        `https://${connection.toString()}.infura.io/${process.env.INFURA_API_KEY}`
      ];
    default:
      return [
        connection
      ];
  }
};