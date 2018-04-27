import { CoreSigner } from "../signers/CoreSigner";
import { Wallet, WalletType } from '../types';
import { keystore, signing } from 'eth-lightwallet';
import { CoreBase } from "../shared/CoreBase";
export declare class CoreWallet extends CoreBase implements Wallet {
    private _keystore;
    private _signing;
    private _pwDerivedKey;
    type: WalletType;
    signer: CoreSigner;
    constructor(keystore: keystore, signing: signing, pwDerivedKey: Uint8Array);
    /**
     * Adds one or more accounts to the wallet
     *
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
    serialize(): any;
    /**
     * Exports the wallet's seed phrase
     *
     */
    exportSeedPhraseAsync(password: string): Promise<any>;
    /**
     * Exports the private key for a single account
     *
     */
    exportAccountPrivateKeyAsync(account: string, password: string): Promise<any>;
}
