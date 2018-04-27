import Web3 = require('web3');
import { TransactionManager } from '../types';
import { Subprovider } from './subprovider';
export declare class SigningSubprovider extends Subprovider {
    private _transactionManager;
    constructor(transactionManager: TransactionManager);
    handleRequest(payload: Web3.JSONRPCRequestPayload, next: () => void, end: (err: Error | null, result?: any) => void): Promise<void>;
}
