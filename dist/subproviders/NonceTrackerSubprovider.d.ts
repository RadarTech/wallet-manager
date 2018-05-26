import { JSONRPCRequestPayload } from 'web3';
import { ErrorCallback, NextCallback } from '../types';
import { Subprovider } from './subprovider';
/**
 * This class implements the [web3-provider-engine](https://github.com/MetaMask/provider-engine) subprovider interface.
 * It is heavily inspired by the
 * [NonceSubprovider](https://github.com/MetaMask/provider-engine/blob/master/subproviders/nonce-tracker.js).
 * We added the additional feature of clearing the cached nonce value when a `nonce value too low` error occurs.
 */
export declare class NonceTrackerSubprovider extends Subprovider {
    private _nonceCache;
    private static _reconstructTransaction(payload);
    private static _determineAddress(payload);
    /**
     * This method conforms to the web3-provider-engine interface.
     * It is called internally by the ProviderEngine when it is this subproviders
     * turn to handle a JSON RPC request.
     * @param payload JSON RPC payload
     * @param next Callback to call if this subprovider decides not to handle the request
     * @param end Callback to call if subprovider handled the request and wants to pass back the request.
     */
    handleRequest(payload: JSONRPCRequestPayload, next: NextCallback, end: ErrorCallback): Promise<void>;
    private _handleSuccessfulTransaction(payload);
    private _handleSendTransactionError(payload, err);
}
