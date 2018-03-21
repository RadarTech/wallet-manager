import { CoreSigner } from "../signers/CoreSigner";
import { Wallet, WalletType, WalletError } from '../types';
import { keystore, signing } from 'eth-lightwallet';
import { Store } from "../Store";
import { CoreBase } from "../shared/CoreBase";

export class CoreWallet extends CoreBase implements Wallet {
  private _keystore: keystore;
  private _signing: signing;
  private _pwDerivedKey: Uint8Array;
  public type: WalletType;
  public signer: CoreSigner;

  constructor(keystore: keystore, signing: signing, pwDerivedKey: Uint8Array) {
    super();

    this._keystore = keystore;
    this._signing = signing;
    this._pwDerivedKey = pwDerivedKey;
    this.type = WalletType.Core;
    this.signer = new CoreSigner(keystore, signing, pwDerivedKey);
  }

 /**
  * Adds one or more addresses to the wallet
  * 
  */
  public addNewAddresses(numberOfAddresses: number = 1) {
    this._keystore.generateNewAddress(this._pwDerivedKey, numberOfAddresses);
    this.store.saveCoreWallet(this);
  }

 /**
  * Gets all the addresses from the wallet
  * 
  */
  public getAddresses(): string[] {
    const accounts = this._keystore.getAddresses();
    return accounts;
  }

 /**
  * Serialize the wallet keystore
  * 
  */
  public serialize() {
    return this._keystore.serialize();
  }

 /**
  * Exports the wallet's seed phrase
  * 
  */
  public async exportSeedPhraseAsync(password: string) {
    const pwDerivedKey: Uint8Array = await this.deriveKeyFromPasswordAsync(this._keystore, password);
    this.validatePwDerivedKeyOrThrow(pwDerivedKey, this._keystore);

    return this._keystore.getSeed(pwDerivedKey);
  }

 /**
  * Exports the private key for a single account
  * 
  */
  public async exportAccountPrivateKeyAsync(address: string, password: string) {
    const pwDerivedKey: Uint8Array = await this.deriveKeyFromPasswordAsync(this._keystore, password);
    this.validatePwDerivedKeyOrThrow(pwDerivedKey, this._keystore);

    return this._keystore.exportPrivateKey(address, pwDerivedKey);
  }
}