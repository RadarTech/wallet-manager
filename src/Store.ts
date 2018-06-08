import * as fs from 'fs';
import { Wallet, WalletError } from './types';

export class Store {

  /**
   * Check for any storage support
   */
  public static isStorageSupported(): boolean {
    return Store.isFileStorageSupported() || Store.isLocalStorageSupported();
  }

 /**
  * Check if local storage is supported
  *
  */
  public static isLocalStorageSupported(): boolean {
    if (typeof localStorage === 'undefined') {
      return false;
    }
    const lsSupportTest = 'lsSupportTest';

    try {
      localStorage.setItem(lsSupportTest, lsSupportTest);
      localStorage.removeItem(lsSupportTest);
      return true;
    } catch (err) {
      return false;
    }
  }

  /**
   * Check if file storage is supported
   */
  public static isFileStorageSupported(): boolean {
    if (typeof fs.writeFileSync === 'undefined') return false;

    try {
      fs.writeFileSync('.fsSupportTest', 'test');
      fs.unlinkSync('.fsSupportTest');
      return true;
    } catch (err) {
      return false;
    }
  }

 /**
  * Save the encrypted wallet in local storage
  *
  * @param {Wallet} wallet The wallet to save
  * @param {string} [keyName='s-wallet'] The key identifier
  */
  public static saveWallet(wallet: Wallet, keyName: string = 's-wallet') {
    if (Store.isLocalStorageSupported()) {
      localStorage.setItem(keyName, wallet.serialize());
    } else if (Store.isFileStorageSupported) {
      fs.writeFileSync('.' + keyName, wallet.serialize());
    } else {
      return false;
    }

    return true;
  }

 /**
  * Load the encrypted wallet from local storage
  *
  * @param {string} [keyName='s-wallet']  The key identifier
  */
  public static loadWallet(keyName: string = 's-wallet') {
    let serializedKeystore = null;
    if (Store.isLocalStorageSupported()) {
      serializedKeystore = localStorage.getItem(keyName);
    } else if (Store.isFileStorageSupported()) {
      try {
        serializedKeystore = fs.readFileSync('.' + keyName).toString();
      } catch (err) {
        throw new Error(WalletError.NoWalletFound);
      }
    }

    if (!serializedKeystore) {
      throw new Error(WalletError.NoWalletFound);
    }

    return serializedKeystore;
  }
}
