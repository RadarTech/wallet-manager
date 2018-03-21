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
     * Save the encrypted wallet in local storage
     *
     * @param wallet The wallet to save
     * @param keyName The key identifier
     */
    saveCoreWallet(wallet, keyName = 'radar-core-wallet') {
        localStorage.setItem(keyName, wallet.serialize());
        return true;
    }
    /**
     * Load the encrypted wallet from local storage
     *
     * @param keyName The key identifier
     */
    loadCoreWallet(keyName = 'radar-core-wallet') {
        let keystore = null;
        const serializedKeystore = localStorage.getItem(keyName);
        if (serializedKeystore) {
            keystore = lightwallet.keystore.deserialize(serializedKeystore);
        }
        return keystore;
    }
}
exports.Store = Store;
