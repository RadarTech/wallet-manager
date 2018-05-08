"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const lightwallet = require("eth-lightwallet");
const fs = require("fs");
class Store {
    /**
     * Check for any storage support
     */
    static IsStorageSupported() {
        return Store.IsFileStorageSupported() || Store.IsLocalStorageSupported();
    }
    /**
     * Check if local storage is supported
     *
     */
    static IsLocalStorageSupported() {
        if (typeof localStorage === 'undefined') {
            return false;
        }
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
     * Check if file storage is supported
     */
    static IsFileStorageSupported() {
        if (typeof fs.writeFileSync === 'undefined')
            return false;
        try {
            fs.writeFileSync('.radar-core-wallet', 'test');
            fs.unlinkSync('.radar-core-wallet');
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
        if (Store.IsLocalStorageSupported()) {
            localStorage.setItem(keyName, wallet.serialize());
        }
        else if (Store.IsFileStorageSupported) {
            console.log('storing via file');
            fs.writeFileSync('.' + keyName, wallet.serialize());
        }
        else {
            return false;
        }
        return true;
    }
    /**
     * Load the encrypted wallet from local storage
     *
     * @param keyName The key identifier
     */
    loadCoreWallet(keyName = 'radar-core-wallet') {
        let keystore = null;
        let serializedKeystore = null;
        if (Store.IsLocalStorageSupported()) {
            serializedKeystore = localStorage.getItem(keyName);
        }
        else if (Store.IsFileStorageSupported()) {
            serializedKeystore = fs.readFileSync('.' + keyName).toString();
        }
        if (serializedKeystore) {
            keystore = lightwallet.keystore.deserialize(serializedKeystore);
        }
        return keystore;
    }
}
exports.Store = Store;
