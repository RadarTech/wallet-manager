import * as lightwallet from 'eth-lightwallet';
import { keystore, signing } from 'eth-lightwallet';
import { Vault } from './Vault';

export class Store {

 /**
  * Check if local storage is supported
  * 
  * 
  */
  public isLocalStorageSupported() {
    const lsSupportTest = 'lsSupportTest';

    try {
      localStorage.setItem(lsSupportTest, lsSupportTest);
      localStorage.removeItem(lsSupportTest);
      return true;
    } catch(err) {
      return false;
    }
  }

 /**
  * Save the encrypted vault in local storage
  * 
  * @param vault The vault to save
  * @param keyName The key identifier
  */
  public saveVault(vault: Vault, keyName: string = 'radar-vault') {
    localStorage.setItem(keyName, vault.keystore.serialize());

    return true;
  }

 /**
  * Load the encrypted vault from local storage
  * 
  * @param keyName The key identifier
  */
  public loadVault(keyName: string = 'radar-vault') {
    let keystore = null;
    const serializedKeystore = localStorage.getItem(keyName);

    if (serializedKeystore) {
      keystore = lightwallet.keystore.deserialize(serializedKeystore);
    }

    return keystore;
  }
}