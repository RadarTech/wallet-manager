import { CoreSigner } from '../signers/CoreSigner';
import { Wallet, WalletType, WalletError } from '../types';
import { keystore, signing } from 'eth-lightwallet';
import { Store } from '../Store';
import { CoreBase } from '../shared/CoreBase';

export class CoreWallet extends CoreBase implements Wallet {
  public type: WalletType;
  public signer: CoreSigner;
  private _keystore: keystore;
  private _signing: signing;
  private _pwDerivedKey: Uint8Array;

  constructor(keystore: keystore, signing: signing, pwDerivedKey: Uint8Array) {
    super();

    this._keystore = keystore;
    this._signing = signing;
    this._pwDerivedKey = pwDerivedKey;
    this.type = WalletType.Core;
    this.signer = new CoreSigner(keystore, signing, pwDerivedKey);
  }

 /**
  * Adds one or more accounts to the wallet
  *
  * @param {number} [numberOfAccounts=1] The number of accounts to add
  */
  public addNewAccounts(numberOfAccounts: number = 1): void {
    this._keystore.generateNewAddress(this._pwDerivedKey, numberOfAccounts);
    this.store.saveCoreWallet(this);
  }

 /**
  * Gets all the accounts from the wallet
  *
  */
  public getAccounts(): string[] {
    const accounts = this._keystore.getAddresses();
    return accounts;
  }

 /**
  * Serialize the wallet keystore
  *
  */
  public serialize(): string {
    return this._keystore.serialize();
  }

 /**
  * Exports the wallet's seed phrase
  *
  * @param {string} password The plaintext password
  */
  public async exportSeedPhraseAsync(password: string): Promise<string> {
    const pwDerivedKey: Uint8Array = await this.deriveKeyFromPasswordAsync(this._keystore, password);
    this.validatePwDerivedKeyOrThrow(pwDerivedKey, this._keystore);

    return this._keystore.getSeed(pwDerivedKey);
  }

 /**
  * Exports the private key for a single account
  *
  * @param {string} account The account used for the export
  * @param {string} password The plaintext password
  */
  public async exportAccountPrivateKeyAsync(account: string, password: string): Promise<string> {
    const pwDerivedKey: Uint8Array = await this.deriveKeyFromPasswordAsync(this._keystore, password);
    this.validatePwDerivedKeyOrThrow(pwDerivedKey, this._keystore);

    return this._keystore.exportPrivateKey(account, pwDerivedKey);
  }
}
