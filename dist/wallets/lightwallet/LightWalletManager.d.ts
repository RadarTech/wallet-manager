import { LightWalletOptions } from '../../types';
import { LightWallet } from './LightWallet';
import { LightWalletBase } from './LightWalletBase';
export declare class LightWalletManager extends LightWalletBase {
    /**
     * Creates a new lightwallet and saves it in local storage
     *
     * @param options LightWallet initialization options
     */
    createWalletAsync(options: LightWalletOptions): Promise<LightWallet>;
    /**
     * Save the wallet
     *
     * @param {LightWallet} wallet The wallet instance
     */
    saveWallet(wallet: LightWallet, keyName?: string): void;
    /**
     * Loads a wallet from local storage
     *
     * @param {string} password The plaintext password
     */
    loadWalletAsync(password: string, keyName?: string): Promise<LightWallet>;
    /**
     * Initializes a new eth-lightwallet keystore
     *
     * @param {LightWalletOptions} options LightWallet initialization options
     */
    private initializeKeystoreAsync(options);
    /**
     * Populate the missing wallet options
     *
     * @param {LightWalletOptions} options LightWallet initialization options
     */
    private populateMissingOptions(options);
    /**
     * Throw the appropriate exception on error
     *
     * @param {WalletError[]} errors An array of possible WalletErrors
     */
    private throwOnError(...errors);
    /**
     * Validate the seed or throw an InvalidSeed exception
     *
     * @param {string} seed The seed to validate
     */
    private validateSeedPhraseOrThrow(seed);
}
