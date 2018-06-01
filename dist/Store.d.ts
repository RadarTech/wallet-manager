import { Wallet } from './types';
export declare class Store {
    /**
     * Check for any storage support
     */
    static IsStorageSupported(): boolean;
    /**
     * Check if local storage is supported
     *
     */
    static IsLocalStorageSupported(): boolean;
    /**
     * Check if file storage is supported
     */
    static IsFileStorageSupported(): boolean;
    /**
     * Save the encrypted wallet in local storage
     *
     * @param {Wallet} wallet The wallet to save
     * @param {string} [keyName='s-wallet'] The key identifier
     */
    saveWallet(wallet: Wallet, keyName?: string): boolean;
    /**
     * Load the encrypted wallet from local storage
     *
     * @param {string} [keyName='s-wallet']  The key identifier
     */
    loadWallet(keyName?: string): any;
}
