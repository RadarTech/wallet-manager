import { LightWalletSigner } from './LightWalletSigner';
import { Wallet, WalletType } from '../../types';
import { keystore, signing } from 'eth-lightwallet';
import { Store } from '../../Store';
import { LightWalletUtils } from './LightWalletUtils';

type SigningType = typeof signing;

export class LightWallet implements Wallet {
  public type: WalletType;
  public signer: LightWalletSigner;
  public keystore: keystore;
  public signing: SigningType;
  public pwDerivedKey: Uint8Array;

  constructor(keystore: keystore, signing: SigningType, pwDerivedKey: Uint8Array) {
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
    Store.saveWallet(this);
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
    const pwDerivedKey: Uint8Array = await LightWalletUtils.deriveKeyFromPasswordAsync(this.keystore, password);
    LightWalletUtils.validatePwDerivedKeyOrThrow(pwDerivedKey, this.keystore);

    return this.keystore.getSeed(pwDerivedKey);
  }

 /**
  * Exports the private key for a single account
  *
  * @param {string} account The account used for the export
  * @param {string} password The plaintext password
  */
  public async exportAccountPrivateKeyAsync(account: string, password: string): Promise<string> {
    const pwDerivedKey: Uint8Array = await LightWalletUtils.deriveKeyFromPasswordAsync(this.keystore, password);
    LightWalletUtils.validatePwDerivedKeyOrThrow(pwDerivedKey, this.keystore);

    return this.keystore.exportPrivateKey(account, pwDerivedKey);
  }
}
