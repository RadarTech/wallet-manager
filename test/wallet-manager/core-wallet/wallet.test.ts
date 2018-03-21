import * as mocha from 'mocha';
import * as chai from 'chai';
import { WalletManager } from '../../../src/WalletManager';
import { WalletError } from '../../../src/types';
import { CoreWallet } from '../../../src/Wallets/CoreWallet';

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
      const preAddCount = coreWallet.getAddresses().length;

      // Add a new account
      coreWallet.addNewAddresses(1);

      const numberOfAccountsAdded = coreWallet.getAddresses().length - preAddCount;

      // One account should have been added
      expect(numberOfAccountsAdded).to.equal(1);
    });

    it('can add a multiple accounts', async () => {
      const preAddCount = coreWallet.getAddresses().length;

      // Add a new account
      coreWallet.addNewAddresses(3);

      const numberOfAccountsAdded = coreWallet.getAddresses().length - preAddCount;

      // Three accounts should have been added
      expect(numberOfAccountsAdded).to.equal(3);
    });

    it('can export the private key of an account', async () => {
      // Export the private key of the first account
      const firstAddress = coreWallet.getAddresses()[0];
      const privateKey = await coreWallet.exportAccountPrivateKeyAsync(firstAddress, password);

      // Private key should be 64 chars long
      expect(privateKey.length).to.equal(64);
    });

    it('can export the seed phrase', async () => {
        // Export the seed phrase
        const seedPhrase = await coreWallet.exportSeedPhraseAsync(password);

        // Seed phrase should be 12 words
        expect(seedPhrase.split(' ').length).to.equal(12);
    });

    it('can get all accounts (addresses)', async () => {
      // Add new addresses
      coreWallet.addNewAddresses(10);
      
      // Get all addresses
      const addresses = coreWallet.getAddresses();

      // There should be 11 addresses (Initial + 10 added)
      expect(addresses.length).to.equal(11);
    });

    it('can serialize the wallet', async () => {
      // Serialize the wallet
      const serializedWallet = coreWallet.serialize();

      // Serialized wallet should be a string
      expect(typeof serializedWallet).to.equal('string')
    });
});
