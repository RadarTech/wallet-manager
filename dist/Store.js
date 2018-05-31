"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
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
            fs.writeFileSync('.fsSupportTest', 'test');
            fs.unlinkSync('.fsSupportTest');
            return true;
        }
        catch (err) {
            return false;
        }
    }
    /**
     * Save the encrypted wallet in local storage
     *
     * @param {Wallet} wallet The wallet to save
     * @param {string} [keyName='s-wallet'] The key identifier
     */
    saveWallet(wallet, keyName = 's-wallet') {
        if (Store.IsLocalStorageSupported()) {
            localStorage.setItem(keyName, wallet.serialize());
        }
        else if (Store.IsFileStorageSupported) {
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
     * @param {string} [keyName='s-wallet']  The key identifier
     */
    loadWallet(keyName = 's-wallet') {
        let serializedKeystore = null;
        if (Store.IsLocalStorageSupported()) {
            serializedKeystore = localStorage.getItem(keyName);
        }
        else if (Store.IsFileStorageSupported()) {
            serializedKeystore = fs.readFileSync('.' + keyName).toString();
        }
        return serializedKeystore;
    }
}
exports.Store = Store;
