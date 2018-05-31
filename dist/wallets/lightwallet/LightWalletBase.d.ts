import { keystore } from 'eth-lightwallet';
import { Store } from '../../Store';
export declare class LightWalletBase {
    protected store: Store;
    constructor();
    /**
     * Derives a symmetric key from the plaintext password and salt
     *
     * @param {keystore} keystore The wallet's keystore instance
     * @param {string} password The plaintext password
     */
    protected deriveKeyFromPasswordAsync(keystore: keystore, password: string): Promise<Uint8Array>;
    /**
     * Validate the pwDerivedKey or throw an InvalidPassword exception
     *
     * @param {Uint8Array} pwDerivedKey The password derived symmetric key
     * @param {keystore} keystore The lightwallet keystore
     */
    protected validatePwDerivedKeyOrThrow(pwDerivedKey: Uint8Array, keystore: keystore): void;
}
