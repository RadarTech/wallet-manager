import { keystore, signing } from 'eth-lightwallet';

export interface CoreWalletOptions {
  password: string;
  seedPhrase?: string;
  salt?: string;
  hdPathString?: string;
}

export interface ECSignatureBuffer {
  v: number;
  r: Buffer;
  s: Buffer;
}

export interface PartialTxParams {
  nonce: string;
  gasPrice?: string;
  gas: string;
  to: string;
  from: string;
  value?: string;
  data?: string;
  chainId: number; // EIP 155 chainId - mainnet: 1, ropsten: 3
}

export interface JSONRPCPayload {
  params: any[];
  method: string;
}

export interface Signer {
  signPersonalMessageAsync(address: string, message: string): Promise<string>;
  signTransactionAsync(txParams: PartialTxParams): Promise<string>;
}

export interface Wallet {
  type: WalletType;
  signer: Signer;
}

export interface TransactionManager {
  sendTransaction(): void;
  signMessage(): void;
}

export enum WalletError {
  LocalStorageDisabled = 'LOCAL_STORAGE_DISABLED',
  NoWalletFound = 'NO_WALLET_FOUND',
  InvalidSeed = 'INVALID_SEED',
  InvalidPassword = 'INVALID_PASSWORD',
}

export enum SigningError {
  UserDeclined = 'USER_DECLINED'
}

export enum WalletType {
  Core,
  Ledger
}

export enum InfuraNetwork {
  Mainnet,
  Kovan,
  Rinkeby,
  Ropsten
}

export declare type RpcConnection = string | InfuraNetwork;