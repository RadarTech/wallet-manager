// eth-lightwallet declarations
declare module 'eth-lightwallet' {
  export class signing {
    public static signTx(keystore: keystore, pwDerivedKey: Uint8Array, rawTx: string, signingAddress: string);
    public static signMsg(keystore: keystore, pwDerivedKey: Uint8Array, rawMsg: string, signingAddress: string);
    public static signMsgHash(keystore: keystore, pwDerivedKey: Uint8Array, msgHash: string, signingAddress: string);
    public static concatSig(signature: any);
  }
  export class keystore {
      public static createVault(options: any, callback?: (error, keystore: keystore) => void);
      public static generateRandomSeed();
      public static isSeedValid(seed: string);
      public static deserialize(keystore: string);
      public serialize();
      public keyFromPassword(password: string, callback?: (error, pwDerivedKey: Uint8Array) => void);
      public isDerivedKeyCorrect(pwDerivedKey: Uint8Array);
      public generateNewAddress(pwDerivedKey: Uint8Array, numberOfAddresses: number);
      public getSeed(pwDerivedKey: Uint8Array);
      public exportPrivateKey(address: string, pwDerivedKey: Uint8Array);
      public getAddresses();
  }
}
