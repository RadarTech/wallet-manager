import * as lightwallet from 'eth-lightwallet';
import { PartialTxParams, Signer } from '../types';
export declare class CoreSigner implements Signer {
    private _keystore;
    private _signing;
    private _pwDerivedKey;
    constructor(keystore: lightwallet.keystore, signing: lightwallet.signing, pwDerivedKey: Uint8Array);
    /**
     * Sign a personal message hash
     *
     * @param account The account to sign with
     * @param hash The hash to sign
     */
    signPersonalMessageHashAsync(account: string, hash: string): Promise<string>;
    /**
     * Sign a personal message
     *
     * @param account The account to sign with
     * @param message The message to sign
     */
    signPersonalMessageAsync(account: string, message: string): Promise<string>;
    /**
     * Sign a transaction
     *
     * @param txParams The transaction parameters
     */
    signTransactionAsync(txParams: PartialTxParams): Promise<string>;
}
