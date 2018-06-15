export interface LightWalletOptions {
  password: string;
  seedPhrase?: string;
  salt?: string;
  hdPathString?: string;
  storageKeyName?: string;
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
  from?: string;
  value?: string;
  data?: string;
  chainId: number; // EIP 155 chainId - mainnet: 1, ropsten: 3
}

export interface Signer {
  signPersonalMessageAsync(account: string, message: string): Promise<string>;
  signPersonalMessageHashAsync(account: string, hash: string): Promise<string>;
  signTransactionAsync(txParams: PartialTxParams): Promise<string>;
}

export interface Wallet {
  type: WalletType;
  signer: Signer;
  getAccounts(): string[];
  serialize(): string;
}

export enum WalletError {
  StorageDisabled = 'STORAGE_DISABLED',
  NoWalletFound = 'NO_WALLET_FOUND',
  InvalidSeed = 'INVALID_SEED',
  InvalidPassword = 'INVALID_PASSWORD',
}

export enum SigningError {
  UserDeclined = 'USER_DECLINED'
}

export enum WalletType {
  LightWallet
}

export type ErrorCallback = (err: Error | null, data?: any) => void;
export type Callback = () => void;
export type OnNextCompleted = (err: Error | null, result: any, cb: Callback) => void;
export type NextCallback = (callback?: OnNextCompleted) => void;

export enum NonceSubproviderErrors {
  EmptyParametersFound = 'EMPTY_PARAMETERS_FOUND',
  CannotDetermineAddressFromPayload = 'CANNOT_DETERMINE_ADDRESS_FROM_PAYLOAD',
}

export enum InfuraNetwork {
  Mainnet = 'mainnet',
  Kovan = 'kovan',
  Rinkeby = 'rinkeby',
  Ropsten = 'ropsten',
}
