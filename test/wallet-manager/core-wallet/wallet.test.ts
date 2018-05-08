import * as mocha from 'mocha';
import * as chai from 'chai';
import { WalletManager } from '../../../src/WalletManager';
import { WalletError } from '../../../src/types';
import { CoreWallet } from '../../../src/wallets/CoreWallet';

const expect = chai.expect;

/* tslint:disable:no-unused-expression */
describe('CoreWallet', () => {
    const password = 'supersecretpassword99';
    let coreWallet: CoreWallet;

    beforeEach(async () => {
      const walletManager = new WalletManager();
      coreWallet = await walletManager.core.createWalletAsync({ password });
    });

    it('can add a single account', async () => {
      const preAddCount = coreWallet.getAccounts().length;

      // Add a new account
      coreWallet.addNewAccounts(1);

      const numberOfAccountsAdded = coreWallet.getAccounts().length - preAddCount;

      // One account should have been added
      expect(numberOfAccountsAdded).to.equal(1);
    });

    it('can add a multiple accounts', async () => {
      const preAddCount = coreWallet.getAccounts().length;

      // Add a new account
      coreWallet.addNewAccounts(3);

      const numberOfAccountsAdded = coreWallet.getAccounts().length - preAddCount;

      // Three accounts should have been added
      expect(numberOfAccountsAdded).to.equal(3);
    });

    it('can export the private key of an account', async () => {
      // Export the private key of the first account
      const firstAccount = coreWallet.getAccounts()[0];
      const privateKey = await coreWallet.exportAccountPrivateKeyAsync(firstAccount, password);

      // Private key should be 64 chars long
      expect(privateKey.length).to.equal(64);
    });

    it('can export the seed phrase', async () => {
        // Export the seed phrase
        const seedPhrase = await coreWallet.exportSeedPhraseAsync(password);

        // Seed phrase should be 12 words
        expect(seedPhrase.split(' ').length).to.equal(12);
    });

    it('can get all accounts', async () => {
      // Add new accounts
      coreWallet.addNewAccounts(10);
      
      // Get all accounts
      const accounts = coreWallet.getAccounts();

      // There should be 11 accounts (Initial + 10 added)
      expect(accounts.length).to.equal(11);
    });

    it('can serialize the wallet', async () => {
      // Serialize the wallet
      const serializedWallet = coreWallet.serialize();

      // Serialized wallet should be a string
      expect(typeof serializedWallet).to.equal('string')
    });
});
