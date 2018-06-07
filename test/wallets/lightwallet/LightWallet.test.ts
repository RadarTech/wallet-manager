import * as chai from 'chai';
import { LightWallet, LightWalletManager } from '../../../src/wallets/lightwallet';

const expect = chai.expect;

/* tslint:disable:no-unused-expression */
describe('LightWallet', () => {
  const password = 'supersecretpassword99';
  const storageKeyName = 'lightwallet';
  let lightWallet: LightWallet;

  beforeEach(async () => {
    const walletManager = new LightWalletManager();
    lightWallet = await walletManager.createWalletAsync({ password, storageKeyName });
  });

  it('can add a single account', async () => {
    const preAddCount = lightWallet.getAccounts().length;

    // Add a new account
    lightWallet.addNewAccounts(1);

    const numberOfAccountsAdded = lightWallet.getAccounts().length - preAddCount;

    // One account should have been added
    expect(numberOfAccountsAdded).to.equal(1);
  });

  it('can add a multiple accounts', async () => {
    const preAddCount = lightWallet.getAccounts().length;

    // Add a new account
    lightWallet.addNewAccounts(3);

    const numberOfAccountsAdded = lightWallet.getAccounts().length - preAddCount;

    // Three accounts should have been added
    expect(numberOfAccountsAdded).to.equal(3);
  });

  it('can export the private key of an account', async () => {
    // Export the private key of the first account
    const firstAccount = lightWallet.getAccounts()[0];
    const privateKey = await lightWallet.exportAccountPrivateKeyAsync(firstAccount, password);

    // Private key should be 64 chars long
    expect(privateKey.length).to.equal(64);
  });

  it('can export the seed phrase', async () => {
    // Export the seed phrase
    const seedPhrase = await lightWallet.exportSeedPhraseAsync(password);

    // Seed phrase should be 12 words
    expect(seedPhrase.split(' ').length).to.equal(12);
  });

  it('can get all accounts', async () => {
    // Add new accounts
    lightWallet.addNewAccounts(10);

    // Get all accounts
    const accounts = lightWallet.getAccounts();

    // There should be 11 accounts (Initial + 10 added)
    expect(accounts.length).to.equal(11);
  });

  it('can serialize the wallet', async () => {
    // Serialize the wallet
    const serializedWallet = lightWallet.serialize();

    // Serialized wallet should be a string
    expect(typeof serializedWallet).to.equal('string');
  });
});
