import { keystore } from 'eth-lightwallet';
export declare class LightWalletUtils {
    /**
     * Derives a symmetric key from the plaintext password and salt
     *
     * @param {keystore} keystore The wallet's keystore instance
     * @param {string} password The plaintext password
     */
    static deriveKeyFromPasswordAsync(keystore: keystore, password: string): Promise<Uint8Array>;
    /**
     * Validate the pwDerivedKey or throw an InvalidPassword exception
     *
     * @param {Uint8Array} pwDerivedKey The password derived symmetric key
     * @param {keystore} keystore The lightwallet keystore
     */
    static validatePwDerivedKeyOrThrow(pwDerivedKey: Uint8Array, keystore: keystore): void;
}
