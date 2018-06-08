import * as lightwallet from 'eth-lightwallet';
import * as _ from 'lodash';
import { Store } from '../../Store';
import { LightWalletOptions, WalletError } from '../../types';
import { DEFAULT_DERIVATION_PATH } from '../../constants';
import { LightWallet } from './LightWallet';
import { LightWalletUtils } from './LightWalletUtils';

export class LightWalletManager {

  /**
   * Creates a new lightwallet and saves it in local storage
   *
   * @param options LightWallet initialization options
   */
  public static async createWalletAsync(options: LightWalletOptions): Promise<LightWallet> {
    const filledOptions = this.populateMissingOptions(options);

    this.throwOnError(WalletError.StorageDisabled);
    this.validateSeedPhraseOrThrow(options.seedPhrase);

    const keystore: lightwallet.keystore = await this.initializeKeystoreAsync(filledOptions);
    const pwDerivedKey: Uint8Array = await LightWalletUtils.deriveKeyFromPasswordAsync(keystore, options.password);

    keystore.generateNewAddress(pwDerivedKey, 1);

    const lightWallet = new LightWallet(keystore, lightwallet.signing, pwDerivedKey);
    Store.saveWallet(lightWallet, options.storageKeyName);
    return lightWallet;
  }

  /**
   * Save the wallet
   *
   * @param {LightWallet} wallet The wallet instance
   */
  public static saveWallet(wallet: LightWallet, keyName?: string): void {
    if (wallet) Store.saveWallet(wallet, keyName);
  }

  /**
   * Loads a wallet from local storage
   *
   * @param {string} password The plaintext password
   */
  public static async loadWalletAsync(password: string, keyName?: string): Promise<LightWallet> {
    const serializedKeystore = Store.loadWallet(keyName);
    const keystore = lightwallet.keystore.deserialize(serializedKeystore);
    const pwDerivedKey: Uint8Array = await LightWalletUtils.deriveKeyFromPasswordAsync(keystore, password);
    LightWalletUtils.validatePwDerivedKeyOrThrow(pwDerivedKey, keystore);

    return new LightWallet(keystore, lightwallet.signing, pwDerivedKey);
  }

  /**
   * Initializes a new eth-lightwallet keystore
   *
   * @param {LightWalletOptions} options LightWallet initialization options
   */
  private static async initializeKeystoreAsync(options: LightWalletOptions): Promise<lightwallet.keystore> {
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
  private static populateMissingOptions(options: LightWalletOptions): LightWalletOptions {
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
  private static throwOnError(...errors: WalletError[]) {
    for (const error of errors) {
      switch (error) {
        case WalletError.StorageDisabled:
          if (!Store.isStorageSupported()) throw new Error(WalletError.StorageDisabled);
        break;
      }
    }
  }

  /**
   * Validate the seed or throw an InvalidSeed exception
   *
   * @param {string} seed The seed to validate
   */
  private static validateSeedPhraseOrThrow(seed: string): void {
    const valid = lightwallet.keystore.isSeedValid(seed);

    if (!valid) {
      throw new Error(WalletError.InvalidSeed);
    }
  }
}
