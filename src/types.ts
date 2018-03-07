import { keystore, signing } from 'eth-lightwallet';

export interface VaultOptions {
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

export enum VaultError {
  LocalStorageDisabled = 'LOCAL_STORAGE_DISABLED',
  NoVaultFound = 'NO_VAULT_FOUND'
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