import { Vault } from './Vault';
export declare class Store {
    /**
     * Check if local storage is supported
     *
     *
     */
    isLocalStorageSupported(): boolean;
    /**
     * Save the encrypted vault in local storage
     *
     * @param vault The vault to save
     * @param keyName The key identifier
     */
    saveVault(vault: Vault, keyName?: string): boolean;
    /**
     * Load the encrypted vault from local storage
     *
     * @param keyName The key identifier
     */
    loadVault(keyName?: string): any;
}
