import { JSONRPCPayload } from '../types';
import { Subprovider } from './subprovider';
export declare class RedundantRPCSubprovider extends Subprovider {
    private _rpcs;
    private static _firstSuccessAsync(rpcs, payload, next);
    constructor(endpoints: string[]);
    handleRequest(payload: JSONRPCPayload, next: () => void, end: (err: Error | null, data?: any) => void): Promise<void>;
}
