import * as lightwallet from 'eth-lightwallet';
import { CoreWallet } from './wallets/CoreWallet';
import * as fs from 'fs';

export class Store {

  /**
   * Check for any storage support
   */
  public static IsStorageSupported(): boolean {
    return Store.IsFileStorageSupported() || Store.IsLocalStorageSupported();
  }

 /**
  * Check if local storage is supported
  *
  */
  public static IsLocalStorageSupported(): boolean {
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
  public static IsFileStorageSupported(): boolean {
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
  * @param {CoreWallet} wallet The wallet to save
  * @param {string} [keyName='radar-core-wallet'] The key identifier
  */
  public saveCoreWallet(wallet: CoreWallet, keyName: string = 'radar-core-wallet') {
    if (Store.IsLocalStorageSupported()) {
      localStorage.setItem(keyName, wallet.serialize());
    } else if (Store.IsFileStorageSupported) {
      fs.writeFileSync('.' + keyName, wallet.serialize());
    } else {
      return false;
    }

    return true;
  }

 /**
  * Load the encrypted wallet from local storage
  *
  * @param {string} [keyName='radar-core-wallet']  The key identifier
  */
  public loadCoreWallet(keyName: string = 'radar-core-wallet') {
    let keystore = null;
    let serializedKeystore = null;

    if (Store.IsLocalStorageSupported()) {
      serializedKeystore = localStorage.getItem(keyName);
    } else if (Store.IsFileStorageSupported()) {
      serializedKeystore = fs.readFileSync('.' + keyName).toString();
    }

    if (serializedKeystore) {
      keystore = lightwallet.keystore.deserialize(serializedKeystore);
    }

    return keystore;
  }
}
