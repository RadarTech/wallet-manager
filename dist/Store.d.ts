import { CoreWallet } from './wallets/CoreWallet';
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
     * @param wallet The wallet to save
     * @param keyName The key identifier
     */
    saveCoreWallet(wallet: CoreWallet, keyName?: string): boolean;
    /**
     * Load the encrypted wallet from local storage
     *
     * @param keyName The key identifier
     */
    loadCoreWallet(keyName?: string): any;
}
