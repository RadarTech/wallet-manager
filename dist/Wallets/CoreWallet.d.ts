import { CoreSigner } from '../signers/CoreSigner';
import { Wallet, WalletType } from '../types';
import { keystore, signing } from 'eth-lightwallet';
import { CoreBase } from '../shared/CoreBase';
export declare class CoreWallet extends CoreBase implements Wallet {
    type: WalletType;
    signer: CoreSigner;
    private _keystore;
    private _signing;
    private _pwDerivedKey;
    constructor(keystore: keystore, signing: signing, pwDerivedKey: Uint8Array);
    /**
     * Adds one or more accounts to the wallet
     *
     * @param {number} [numberOfAccounts=1] The number of accounts to add
     */
    addNewAccounts(numberOfAccounts?: number): void;
    /**
     * Gets all the accounts from the wallet
     *
     */
    getAccounts(): string[];
    /**
     * Serialize the wallet keystore
     *
     */
    serialize(): string;
    /**
     * Exports the wallet's seed phrase
     *
     * @param {string} password The plaintext password
     */
    exportSeedPhraseAsync(password: string): Promise<string>;
    /**
     * Exports the private key for a single account
     *
     * @param {string} account The account used for the export
     * @param {string} password The plaintext password
     */
    exportAccountPrivateKeyAsync(account: string, password: string): Promise<string>;
}
