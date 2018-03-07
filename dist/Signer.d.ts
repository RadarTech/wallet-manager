import * as lightwallet from 'eth-lightwallet';
import { PartialTxParams } from './types';
export declare class Signer {
    private _signing;
    private _keystore;
    private _pwDerivedKey;
    private _nonceLock;
    private _engine;
    constructor(signing: lightwallet.signing, keystore: lightwallet.keystore, pwDerivedKey: Uint8Array);
    /**
     * Set the web3 provider engine
     *
     * @param engine The provider engine instance
     */
    setEngine(engine: any): void;
    /**
     * Get all accounts from the keystore instance
     *
     */
    getAccounts(): string[];
    /**
     * Sign a personal message
     *
     * @param address The address to sign with
     * @param message The message to sign
     */
    signPersonalMessageAsync(address: string, message: string): Promise<string>;
    /**
     * Send a transaction
     *
     * @param txParams The transaction parameters
     */
    sendTransactionAsync(txParams: PartialTxParams): Promise<string>;
    /**
     * Sign a transaction
     *
     * @param txParams The transaction parameters
     */
    private signTransactionAsync(txParams);
    /**
     * Populate the missing transaction parameters
     *
     * @param txParams The transaction parameters
     */
    private populateMissingTxParamsAsync(txParams);
    /**
     * Generate a random id used on the rpc request
     *
     */
    private getRandomId();
    /**
     * Create the final RPC payload
     *
     * @param payload The payload method and parameters
     */
    private createFinalPayload(payload);
    /**
     * Send the final RPC payload
     *
     * @param payload The payload method and parameters
     */
    private emitPayloadAsync(payload);
}
