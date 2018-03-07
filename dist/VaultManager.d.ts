import { VaultOptions } from './types';
export declare class VaultManager {
    private _store;
    private _vault;
    constructor();
    /**
     * Creates a new vault and saves it in local storage
     *
     * @param options Vault initialization options
     */
    createVault(options: VaultOptions): Promise<void>;
    /**
     * Save the vault and remove it from memory
     *
     */
    lockVault(): void;
    /**
     * Loads a vault from local storage
     *
     * @param password The plaintext password
     */
    unlockVault(password: string): Promise<boolean>;
    /**
     * Adds one or more addresses to the vault
     *
     */
    addNewAddresses(numberOfAddresses?: number): void;
    /**
     * Exports the vault's recovery phrase
     *
     */
    exportRecoveryPhrase(): any;
    /**
     * Exports the private key for a single account
     *
     */
    exportAccountPrivateKey(address: string): any;
    /**
     * Initializes a new eth-lightwallet keystore
     *
     * @param options Vault initialization options
     */
    private initializeKeystore(options);
    /**
     * Derives a symmetric key from the plaintext password and salt
     *
     * @param keystore The vault's keystore instance
     * @param password The plaintext password
     */
    private deriveKeyFromPassword(keystore, password);
}
