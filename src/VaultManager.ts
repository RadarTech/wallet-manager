import * as lightwallet from 'eth-lightwallet';
import * as _ from 'lodash';
import { keystore } from 'eth-lightwallet';
import { Store } from './Store';
import { VaultOptions, VaultError } from './types';
import { Vault } from './Vault';
import { DEFAULT_DERIVATION_PATH } from './constants';

export class VaultManager {
  private _store: Store;
  private _vault: Vault;
  private _activeAddress: string;

  constructor() {
    this._store = new Store();
  }

 /**
  * Get the active address
  * 
  */
  public getActiveAddress() {
    return this._activeAddress;
  }

 /**
  * Set the active address
  * 
  * @param address The address
  */
  public setActiveAddress(address: string) {
    this._activeAddress = address;
  }

 /**
  * Creates a new vault and saves it in local storage
  * 
  * @param options Vault initialization options
  */
  public async createVault(options: VaultOptions) {
    const filledOptions = this.populateMissingOptions(options);

    this.throwOnError(VaultError.LocalStorageDisabled);
    
    const keystore: keystore = await this.initializeKeystore(filledOptions);
    const pwDerivedKey: Uint8Array = await this.deriveKeyFromPassword(keystore, options.password);

    keystore.generateNewAddress(pwDerivedKey, 1);

    this._vault = new Vault(keystore, lightwallet.signing, pwDerivedKey);
    this._store.saveVault(this._vault);
  }

 /**
  * Save the vault and remove it from memory
  * 
  */
  public lockVault() {
    if (this._vault) this._store.saveVault(this._vault);
    this._vault = null;
  }

 /**
  * Loads a vault from local storage
  * 
  * @param password The plaintext password
  */
  public async unlockVault(password: string) {
    const keystore = this._store.loadVault();

    if (keystore) {
      const pwDerivedKey: Uint8Array = await this.deriveKeyFromPassword(keystore, password);
      this._vault = new Vault(keystore, lightwallet.signing, pwDerivedKey);

      return true;
    }
    return false;
  }

 /**
  * Adds one or more addresses to the vault
  * 
  */
  public addNewAddresses(numberOfAddresses: number = 1) {
    this.throwOnError(VaultError.NoVaultFound);

    this._vault.keystore.generateNewAddress(this._vault.pwDerivedKey, numberOfAddresses);
    this._store.saveVault(this._vault);
  }

 /**
  * Gets all the addresses from the vault
  * 
  */
  public getAddresses(): string[] {
    this.throwOnError(VaultError.NoVaultFound);

    const accounts = this._vault.keystore.getAddresses();
    return accounts;
  }

 /**
  * Exports the vault's recovery phrase
  * 
  */
  public exportRecoveryPhrase() {
    this.throwOnError(VaultError.NoVaultFound);

    return this._vault.keystore.getSeed(this._vault.pwDerivedKey);
  }

 /**
  * Exports the private key for a single account
  * 
  */
  public exportAccountPrivateKey(address: string) {
    this.throwOnError(VaultError.NoVaultFound);

    return this._vault.keystore.exportPrivateKey(address, this._vault.pwDerivedKey);
  }

 /**
  * Initializes a new eth-lightwallet keystore
  * 
  * @param options Vault initialization options
  */
  private async initializeKeystore(options: VaultOptions) {
    return new Promise<keystore>((resolve) => {
      // Create Vault
      lightwallet.keystore.createVault(options, (err, keystore) => {
          resolve(keystore);
      });
    });
  }

 /**
  * Derives a symmetric key from the plaintext password and salt
  * 
  * @param keystore The vault's keystore instance
  * @param password The plaintext password
  */
  private async deriveKeyFromPassword(keystore: keystore, password: string) {
    return new Promise<Uint8Array>((resolve) => {
      keystore.keyFromPassword(password, (err, pwDerivedKey: Uint8Array) => {
          resolve(pwDerivedKey);
      });
    });
  }

 /**
  * Populate the missing vault options
  * 
  * @param options Vault initialization options
  */
  private populateMissingOptions(options: VaultOptions) {
    if (_.isUndefined(options.hdPathString)) {
      options.hdPathString = DEFAULT_DERIVATION_PATH;
    }
    if (_.isUndefined(options.seedPhrase)) {
      options.seedPhrase = lightwallet.keystore.generateRandomSeed();
    }
    return options;
  }

 /**
  * Throw the appropriate exception on error
  * 
  * @param errors An array of possible VaultErrors
  */
  private throwOnError(...errors: VaultError[]) {
    for (let i = 0; i < errors.length; i++) {
      switch (errors[i]) {
        case VaultError.NoVaultFound:
          if (!this._vault) throw VaultError.NoVaultFound;
        break;
        case VaultError.LocalStorageDisabled:
          if (!this._store.isLocalStorageSupported()) throw new Error(VaultError.LocalStorageDisabled);
        break;
      }
    }
  }
}