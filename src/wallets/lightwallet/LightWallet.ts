import { LightWalletSigner } from './LightWalletSigner';
import { Wallet, WalletType } from '../../types';
import { keystore, signing } from 'eth-lightwallet';
import { LightWalletBase } from './LightWalletBase';

export class LightWallet extends LightWalletBase implements Wallet {
  public type: WalletType;
  public signer: LightWalletSigner;
  public keystore: keystore;
  public signing: signing;
  public pwDerivedKey: Uint8Array;

  constructor(keystore: keystore, signing: signing, pwDerivedKey: Uint8Array) {
    super();

    this.keystore = keystore;
    this.signing = signing;
    this.pwDerivedKey = pwDerivedKey;
    this.type = WalletType.LightWallet;
    this.signer = new LightWalletSigner(keystore, signing, pwDerivedKey);
  }

 /**
  * Adds one or more accounts to the wallet
  *
  * @param {number} [numberOfAccounts=1] The number of accounts to add
  */
  public addNewAccounts(numberOfAccounts: number = 1): void {
    this.keystore.generateNewAddress(this.pwDerivedKey, numberOfAccounts);
    this.store.saveWallet(this);
  }

 /**
  * Gets all the accounts from the wallet
  *
  */
  public getAccounts(): string[] {
    const accounts = this.keystore.getAddresses();
    return accounts;
  }

 /**
  * Serialize the wallet keystore
  *
  */
  public serialize(): string {
    return this.keystore.serialize();
  }

 /**
  * Exports the wallet's seed phrase
  *
  * @param {string} password The plaintext password
  */
  public async exportSeedPhraseAsync(password: string): Promise<string> {
    const pwDerivedKey: Uint8Array = await this.deriveKeyFromPasswordAsync(this.keystore, password);
    this.validatePwDerivedKeyOrThrow(pwDerivedKey, this.keystore);

    return this.keystore.getSeed(pwDerivedKey);
  }

 /**
  * Exports the private key for a single account
  *
  * @param {string} account The account used for the export
  * @param {string} password The plaintext password
  */
  public async exportAccountPrivateKeyAsync(account: string, password: string): Promise<string> {
    const pwDerivedKey: Uint8Array = await this.deriveKeyFromPasswordAsync(this.keystore, password);
    this.validatePwDerivedKeyOrThrow(pwDerivedKey, this.keystore);

    return this.keystore.exportPrivateKey(account, pwDerivedKey);
  }
}
