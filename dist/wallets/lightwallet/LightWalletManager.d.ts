import { LightWalletOptions } from '../../types';
import { LightWallet } from './LightWallet';
export declare class LightWalletManager {
    /**
     * Creates a new lightwallet and saves it in local storage
     *
     * @param options LightWallet initialization options
     */
    static createWalletAsync(options: LightWalletOptions): Promise<LightWallet>;
    /**
     * Save the wallet
     *
     * @param {LightWallet} wallet The wallet instance
     */
    static saveWallet(wallet: LightWallet, keyName?: string): void;
    /**
     * Loads a wallet from local storage
     *
     * @param {string} password The plaintext password
     */
    static loadWalletAsync(password: string, keyName?: string): Promise<LightWallet>;
    /**
     * Initializes a new eth-lightwallet keystore
     *
     * @param {LightWalletOptions} options LightWallet initialization options
     */
    private static initializeKeystoreAsync;
    /**
     * Populate the missing wallet options
     *
     * @param {LightWalletOptions} options LightWallet initialization options
     */
    private static populateMissingOptions;
    /**
     * Throw the appropriate exception on error
     *
     * @param {WalletError[]} errors An array of possible WalletErrors
     */
    private static throwOnError;
    /**
     * Validate the seed or throw an InvalidSeed exception
     *
     * @param {string} seed The seed to validate
     */
    private static validateSeedPhraseOrThrow;
}
