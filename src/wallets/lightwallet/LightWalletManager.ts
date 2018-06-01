import * as lightwallet from 'eth-lightwallet';
import * as _ from 'lodash';
import { Store } from '../../Store';
import { LightWalletOptions, WalletError } from '../../types';
import { DEFAULT_DERIVATION_PATH } from '../../constants';
import { LightWallet } from './LightWallet';
import { LightWalletBase } from './LightWalletBase';

export class LightWalletManager extends LightWalletBase {

  /**
   * Creates a new lightwallet and saves it in local storage
   *
   * @param options LightWallet initialization options
   */
  public async createWalletAsync(options: LightWalletOptions): Promise<LightWallet> {
    const filledOptions = this.populateMissingOptions(options);

    this.throwOnError(WalletError.StorageDisabled);
    this.validateSeedPhraseOrThrow(options.seedPhrase);

    const keystore: lightwallet.keystore = await this.initializeKeystoreAsync(filledOptions);
    const pwDerivedKey: Uint8Array = await this.deriveKeyFromPasswordAsync(keystore, options.password);

    keystore.generateNewAddress(pwDerivedKey, 1);

    const lightWallet = new LightWallet(keystore, lightwallet.signing, pwDerivedKey);
    this.store.saveWallet(lightWallet, options.storageKeyName);
    return lightWallet;
  }

  /**
   * Save the wallet
   *
   * @param {LightWallet} wallet The wallet instance
   */
  public saveWallet(wallet: LightWallet, keyName?: string): void {
    if (wallet) this.store.saveWallet(wallet, keyName);
  }

  /**
   * Loads a wallet from local storage
   *
   * @param {string} password The plaintext password
   */
  public async loadWalletAsync(password: string, keyName?: string): Promise<LightWallet> {
    const serializedKeystore = this.store.loadWallet(keyName);
    const keystore = lightwallet.keystore.deserialize(serializedKeystore);
    const pwDerivedKey: Uint8Array = await this.deriveKeyFromPasswordAsync(keystore, password);
    this.validatePwDerivedKeyOrThrow(pwDerivedKey, keystore);

    return new LightWallet(keystore, lightwallet.signing, pwDerivedKey);
  }

  /**
   * Initializes a new eth-lightwallet keystore
   *
   * @param {LightWalletOptions} options LightWallet initialization options
   */
  private async initializeKeystoreAsync(options: LightWalletOptions): Promise<lightwallet.keystore> {
    return new Promise<lightwallet.keystore>(resolve => {
      // Create LightWallet
      lightwallet.keystore.createVault(options, (err, keystore) => {
          resolve(keystore);
      });
    });
  }

  /**
   * Populate the missing wallet options
   *
   * @param {LightWalletOptions} options LightWallet initialization options
   */
  private populateMissingOptions(options: LightWalletOptions): LightWalletOptions {
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
   * @param {WalletError[]} errors An array of possible WalletErrors
   */
  private throwOnError(...errors: WalletError[]) {
    for (const error of errors) {
      switch (error) {
        case WalletError.StorageDisabled:
          if (!Store.IsStorageSupported()) throw new Error(WalletError.StorageDisabled);
        break;
      }
    }
  }

  /**
   * Validate the seed or throw an InvalidSeed exception
   *
   * @param {string} seed The seed to validate
   */
  private validateSeedPhraseOrThrow(seed: string): void {
    const valid = lightwallet.keystore.isSeedValid(seed);

    if (!valid) {
      throw new Error(WalletError.InvalidSeed);
    }
  }
}
