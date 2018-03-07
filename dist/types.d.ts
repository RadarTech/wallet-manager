/// <reference types="node" />
export interface VaultOptions {
    password: string;
    seedPhrase?: string;
    salt?: string;
    hdPathString?: string;
}
export interface ECSignatureBuffer {
    v: number;
    r: Buffer;
    s: Buffer;
}
export interface PartialTxParams {
    nonce: string;
    gasPrice?: string;
    gas: string;
    to: string;
    from: string;
    value?: string;
    data?: string;
    chainId: number;
}
export interface JSONRPCPayload {
    params: any[];
    method: string;
}
