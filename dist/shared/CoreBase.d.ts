import { keystore } from "eth-lightwallet";
import { Store } from "../Store";
export declare class CoreBase {
    protected store: Store;
    constructor();
    /**
     * Derives a symmetric key from the plaintext password and salt
     *
     * @param keystore The wallet's keystore instance
     * @param password The plaintext password
     */
    protected deriveKeyFromPasswordAsync(keystore: keystore, password: string): Promise<Uint8Array>;
    /**
     * Validate the pwDerivedKey or throw an InvalidPassword exception
     *
     * @param pwDerivedKey The password derived symmetric key
     */
    protected validatePwDerivedKeyOrThrow(pwDerivedKey: Uint8Array, keystore: keystore): void;
}
