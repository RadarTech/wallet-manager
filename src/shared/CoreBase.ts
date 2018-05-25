import { keystore } from 'eth-lightwallet';
import { Store } from '../Store';
import { WalletError } from '../types';

export class CoreBase {
  protected store: Store;

  constructor() {
    this.store = new Store();
  }

  /**
   * Derives a symmetric key from the plaintext password and salt
   *
   * @param {keystore} keystore The wallet's keystore instance
   * @param {string} password The plaintext password
   */
  protected async deriveKeyFromPasswordAsync(keystore: keystore, password: string): Promise<Uint8Array> {
    return new Promise<Uint8Array>(resolve => {
      keystore.keyFromPassword(password, (err, pwDerivedKey: Uint8Array) => {
        resolve(pwDerivedKey);
      });
    });
  }

  /**
   * Validate the pwDerivedKey or throw an InvalidPassword exception
   *
   * @param {Uint8Array} pwDerivedKey The password derived symmetric key
   * @param {keystore} keystore The lightwallet keystore
   */
  protected validatePwDerivedKeyOrThrow(pwDerivedKey: Uint8Array, keystore: keystore): void {
    const valid = keystore.isDerivedKeyCorrect(pwDerivedKey);

    if (!valid) {
      throw new Error(WalletError.InvalidPassword);
    }
  }
}
