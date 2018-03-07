import { keystore, signing } from 'eth-lightwallet';

export class Vault {
  public keystore: keystore;
  public signing: signing;
  public pwDerivedKey: Uint8Array;
  
  constructor(keystore: keystore, signing: signing, pwDerivedKey: Uint8Array,) {
    this.keystore = keystore;
    this.signing = signing;
    this.pwDerivedKey = pwDerivedKey;
  }
}