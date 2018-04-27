import { JSONRPCPayload } from '../types';
export declare class Subprovider {
    private engine;
    private static getRandomId();
    private static createFinalPayload(payload);
    setEngine(engine: any): void;
    emitPayloadAsync(payload: JSONRPCPayload): Promise<any>;
}
