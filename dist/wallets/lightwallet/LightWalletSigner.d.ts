import * as lightwallet from 'eth-lightwallet';
import { PartialTxParams, Signer } from '../../types';
export declare class LightWalletSigner implements Signer {
    private _keystore;
    private _signing;
    private _pwDerivedKey;
    constructor(keystore: lightwallet.keystore, signing: lightwallet.signing, pwDerivedKey: Uint8Array);
    /**
     * Sign a personal message hash
     *
     * @param {string} account The account to sign with
     * @param {string} hash The hash to sign
     */
    signPersonalMessageHashAsync(account: string, hash: string): Promise<string>;
    /**
     * Sign a personal message
     *
     * @param {string} account The account to sign with
     * @param {string} message The message to sign
     */
    signPersonalMessageAsync(account: string, message: string): Promise<string>;
    /**
     * Sign a transaction
     *
     * @param {PartialTxParams} txParams The transaction parameters
     */
    signTransactionAsync(txParams: PartialTxParams): Promise<string>;
}
