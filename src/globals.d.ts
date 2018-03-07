// web3-provider-engine declarations
declare module 'web3-provider-engine' {
    export class Web3ProviderEngine {
        public on(event: string, handler: () => void): void;
        public send(payload: any): void;
        public sendAsync(payload: any, callback: (error: any, response: any) => void): void;
        public addProvider(provider: any): void;
        public start(): void;
        public stop(): void;
    }
}

// eth-lightwallet declarations
declare module 'eth-lightwallet' {
  export class txutils {
      // TODO: Add function definitions
  }
  export class encryption {
      // TODO: Add function definitions
  }
  export class signing {
    public static signTx(keystore: keystore, pwDerivedKey: Uint8Array, rawTx: string, signingAddress: string);
    public static signMsg(keystore: keystore, pwDerivedKey: Uint8Array, rawMsg: string, signingAddress: string);
    public static signMsgHash(keystore: keystore, pwDerivedKey: Uint8Array, msgHash: string, signingAddress: string);
    public static concatSig(signature: any);
  }
  export class keystore {
      public static createVault(options: any, callback?: Function);
      public static generateRandomSeed();
      public static deserialize(keystore: string);
      public serialize();
      public keyFromPassword(password: string, callback?: Function);
      public generateNewAddress(pwDerivedKey: Uint8Array, numberOfAddresses: number);
      public getSeed(pwDerivedKey: Uint8Array);
      public exportPrivateKey(address: string, pwDerivedKey: Uint8Array);
      public getAddresses();
  }
  export class upgrade {
      // TODO: Add function definitions
  }
}