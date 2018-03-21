/// <reference types="node" />
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
    chainId: number;
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
export declare enum WalletError {
    LocalStorageDisabled = "LOCAL_STORAGE_DISABLED",
    NoWalletFound = "NO_WALLET_FOUND",
    InvalidSeed = "INVALID_SEED",
    InvalidPassword = "INVALID_PASSWORD",
}
export declare enum SigningError {
    UserDeclined = "USER_DECLINED",
}
export declare enum WalletType {
    Core = 0,
    Ledger = 1,
}
export declare enum InfuraNetwork {
    Mainnet = 0,
    Kovan = 1,
    Rinkeby = 2,
    Ropsten = 3,
}
export declare type RpcConnection = string | InfuraNetwork;
