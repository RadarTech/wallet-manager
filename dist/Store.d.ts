import { Wallet } from './types';
export declare class Store {
    /**
     * Check for any storage support
     */
    static isStorageSupported(): boolean;
    /**
     * Check if local storage is supported
     *
     */
    static isLocalStorageSupported(): boolean;
    /**
     * Check if file storage is supported
     */
    static isFileStorageSupported(): boolean;
    /**
     * Save the encrypted wallet in local storage
     *
     * @param {Wallet} wallet The wallet to save
     * @param {string} [keyName='s-wallet'] The key identifier
     */
    static saveWallet(wallet: Wallet, keyName?: string): boolean;
    /**
     * Load the encrypted wallet from local storage
     *
     * @param {string} [keyName='s-wallet']  The key identifier
     */
    static loadWallet(keyName?: string): any;
}
