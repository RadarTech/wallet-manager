"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const lightwallet = require("eth-lightwallet");
class Store {
    /**
     * Check if local storage is supported
     *
     *
     */
    isLocalStorageSupported() {
        const lsSupportTest = 'lsSupportTest';
        try {
            localStorage.setItem(lsSupportTest, lsSupportTest);
            localStorage.removeItem(lsSupportTest);
            return true;
        }
        catch (err) {
            return false;
        }
    }
    /**
     * Save the encrypted vault in local storage
     *
     * @param vault The vault to save
     * @param keyName The key identifier
     */
    saveVault(vault, keyName = 'radar-vault') {
        localStorage.setItem(keyName, vault.keystore.serialize());
        return true;
    }
    /**
     * Load the encrypted vault from local storage
     *
     * @param keyName The key identifier
     */
    loadVault(keyName = 'radar-vault') {
        let keystore = null;
        const serializedKeystore = localStorage.getItem(keyName);
        if (serializedKeystore) {
            keystore = lightwallet.keystore.deserialize(serializedKeystore);
        }
        return keystore;
    }
}
exports.Store = Store;
