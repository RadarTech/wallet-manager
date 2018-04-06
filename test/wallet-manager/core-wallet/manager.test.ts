import * as mocha from 'mocha';
import * as chai from 'chai';
import { WalletManager } from '../../../src/WalletManager';
import { WalletError } from '../../../src/types';

const expect = chai.expect;

/* tslint:disable:no-unused-expression */
describe('CoreWalletManager', () => {
    const password = 'supersecretpassword99';
    const localStorageKey = 'radar-core-wallet';

    it('can create a new core wallet', async () => {
        const walletManager = new WalletManager();
        const coreWallet = await walletManager.core.createWalletAsync({ password });

        // Export the seed phrase
        const seedPhrase = await coreWallet.exportSeedPhraseAsync(password);

        // Get Wallet Addresses
        const addresses = coreWallet.getAddresses();

        // Seed phrase should be 12 words
        expect(seedPhrase.split(' ').length).to.equal(12);

        // Wallet should contain 1 address
        expect(addresses.length).to.equal(1);
    });

    it('can save and load the wallet from local storage', async () => {
        const walletManager = new WalletManager();
        let coreWallet = await walletManager.core.createWalletAsync({ password });

        // Remove the wallet from memory
        coreWallet =  null;

        // Reload the wallet from local storage
        coreWallet = await walletManager.core.loadWalletAsync(password);

        // Export the seed phrase
        const seedPhrase = await coreWallet.exportSeedPhraseAsync(password);

        // Get Wallet Addresses
        const addresses = coreWallet.getAddresses();

        // Seed phrase should be 12 words
        expect(seedPhrase.split(' ').length).to.equal(12);

        // Wallet should contain 1 address
        expect(addresses.length).to.equal(1);
    });

    it('throws the correct exception when the supplied password is incorrect', async () => {
        const incorrectPassword = 'thewrongpassword99';
        const walletManager = new WalletManager();

        let errorMessage;
        try {
            // Attempt to load the wallet with an incorrect password
            const coreWallet = await walletManager.core.loadWalletAsync(incorrectPassword);
        } catch(err) {
            errorMessage = err.message;
        }

        expect(errorMessage).to.equal(WalletError.InvalidPassword);
    });

    it('throws the correct exception when no wallet is found', async () => {
        // Remove from local storage
        localStorage.removeItem(localStorageKey);

        const walletManager = new WalletManager();

        let errorMessage;
        try {
            // Attempt to retrieve a wallet that doesn't exist
            const coreWallet = await walletManager.core.loadWalletAsync(password);
        } catch(err) {
            errorMessage = err.message;
        }

        expect(errorMessage).to.equal(WalletError.NoWalletFound);
    });
});
