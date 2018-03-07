import { keystore, signing } from 'eth-lightwallet';
export declare class Vault {
    keystore: keystore;
    signing: signing;
    pwDerivedKey: Uint8Array;
    constructor(keystore: keystore, signing: signing, pwDerivedKey: Uint8Array);
}
