import * as _ from 'lodash';
import * as Web3 from 'web3';
import { TransactionManager, UnsignedPayload, PayloadType, MsgParams } from '../types';
import { Subprovider } from './subprovider';

/*
 * This class implements the web3-provider-engine subprovider interface and forwards
 * requests involving user accounts (getAccounts, sendTransaction, etc...) to the core wallet,
 * which acts as a wrapper for eth-lightwallet.
 * Source: https://github.com/MetaMask/provider-engine/blob/master/subproviders/subprovider.js
 */
export class PassThroughSigningSubprovider extends Subprovider {
    private _transactionManager: TransactionManager;
    constructor(transactionManager: TransactionManager) {
        super();
        this._transactionManager = transactionManager;
    }
    public async handleRequest(
        payload: Web3.JSONRPCRequestPayload,
        next: () => void,
        end: (err: Error | null, result?: any) => void,
    ) {
        switch (payload.method) {
            case 'eth_accounts':
                try {
                    const accounts = this._transactionManager.getAccounts();
                    end(null, accounts);
                } catch (err) {
                    end(err);
                }

                return;

            case 'eth_sendTransaction':
                try {
                    const unsignedTx: UnsignedPayload = {
                        type: PayloadType.Tx,
                        params: payload.params[0]
                    };
                    const signedTx = await this._transactionManager.signTransactionAsync(unsignedTx);

                    // emit a submit
                    const signedTxPayload = {
                        method: 'eth_sendRawTransaction',
                        params: [signedTx],
                    };
                    const result = await this.emitPayloadAsync(signedTxPayload);
                    end(null, result);
                } catch (err) {
                    end(err);
                }

                return;

            case 'eth_sign':
                try {
                    const unsignedMsg: UnsignedPayload = {
                        type: PayloadType.Msg,
                        params: {
                            from: payload.params[0],
                            data: payload.params[1]
                        }
                    };
                    const result = await this._transactionManager.signMessageAsync(unsignedMsg);
                    end(null, result);
                } catch (err) {
                    end(err);
                }
                return;

            default:
                next();
                return;
        }
    }
}
