import * as lightwallet from 'eth-lightwallet';
import * as _ from 'lodash';
import { Store } from '../Store';
import { CoreWalletOptions, WalletError, Wallet, WalletType } from '../types';
import { DEFAULT_DERIVATION_PATH } from '../constants';
import { CoreWallet } from '../wallets/CoreWallet';
import { CoreBase } from '../shared/CoreBase';

export class CoreManager extends CoreBase {

  /**
   * Creates a new core wallet and saves it in local storage
   *
   * @param options CoreWallet initialization options
   */
  public async createWalletAsync(options: CoreWalletOptions): Promise<CoreWallet> {
    const filledOptions = this.populateMissingOptions(options);

    this.throwOnError(WalletError.StorageDisabled);
    this.validateSeedPhraseOrThrow(options.seedPhrase);

    const keystore: lightwallet.keystore = await this.initializeKeystoreAsync(filledOptions);
    const pwDerivedKey: Uint8Array = await this.deriveKeyFromPasswordAsync(keystore, options.password);

    keystore.generateNewAddress(pwDerivedKey, 1);

    const coreWallet = new CoreWallet(keystore, lightwallet.signing, pwDerivedKey);
    this.store.saveCoreWallet(coreWallet);
    return coreWallet;
  }

  /**
   * Save the wallet
   *
   * @param {CoreWallet} wallet The wallet instance
   */
  public saveWallet(wallet: CoreWallet): void {
    if (wallet) this.store.saveCoreWallet(wallet);
  }

  /**
   * Loads a wallet from local storage
   *
   * @param {string} password The plaintext password
   */
  public async loadWalletAsync(password: string): Promise<CoreWallet> {
    const keystore = this.store.loadCoreWallet();
    if (!keystore) {
      throw new Error(WalletError.NoWalletFound);
    }

    const pwDerivedKey: Uint8Array = await this.deriveKeyFromPasswordAsync(keystore, password);
    this.validatePwDerivedKeyOrThrow(pwDerivedKey, keystore);

    return new CoreWallet(keystore, lightwallet.signing, pwDerivedKey);
  }

  /**
   * Initializes a new eth-lightwallet keystore
   *
   * @param {CoreWalletOptions} options CoreWallet initialization options
   */
  private async initializeKeystoreAsync(options: CoreWalletOptions): Promise<lightwallet.keystore> {
    return new Promise<lightwallet.keystore>(resolve => {
      // Create CoreWallet
      lightwallet.keystore.createVault(options, (err, keystore) => {
          resolve(keystore);
      });
    });
  }

  /**
   * Populate the missing wallet options
   *
   * @param {CoreWalletOptions} options CoreWallet initialization options
   */
  private populateMissingOptions(options: CoreWalletOptions): CoreWalletOptions {
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
