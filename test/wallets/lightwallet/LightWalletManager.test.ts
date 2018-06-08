import * as chai from 'chai';
import * as fs from 'fs';
import { Store } from '../../../src/Store';
import { WalletError } from '../../../src/types';
import { LightWalletManager } from '../../../src/wallets/lightwallet';

const expect = chai.expect;

/* tslint:disable:no-unused-expression */
describe('LightWalletManager', () => {
  const password = 'supersecretpassword99';
  const storageKeyName = 'lightwallet';

  it('can create a new lightwallet', async () => {
    const lightWallet = await LightWalletManager.createWalletAsync({ password, storageKeyName });

    // Export the seed phrase
    const seedPhrase = await lightWallet.exportSeedPhraseAsync(password);

    // Get Wallet Accounts
    const accounts = lightWallet.getAccounts();

    // Seed phrase should be 12 words
    expect(seedPhrase.split(' ').length).to.equal(12);

    // Wallet should contain 1 account
    expect(accounts.length).to.equal(1);
  });

  it('can save and load the wallet from local storage or filesystem', async () => {
    let lightWallet = await LightWalletManager.createWalletAsync({ password, storageKeyName });

    // Remove the wallet from memory
    lightWallet = null;

    // Reload the wallet from local storage
    lightWallet = await LightWalletManager.loadWalletAsync(password, storageKeyName);

    // Export the seed phrase
    const seedPhrase = await lightWallet.exportSeedPhraseAsync(password);

    // Get Wallet Accounts
    const accounts = lightWallet.getAccounts();

    // Seed phrase should be 12 words
    expect(seedPhrase.split(' ').length).to.equal(12);

    // Wallet should contain 1 account
    expect(accounts.length).to.equal(1);
  });

  it('throws the correct exception when the supplied password is incorrect', async () => {
    const incorrectPassword = 'thewrongpassword99';

    let errorMessage;
    try {
      // Attempt to load the wallet with an incorrect password
      const lightWallet = await LightWalletManager.loadWalletAsync(incorrectPassword, storageKeyName);
    } catch (err) {
      errorMessage = err.message;
    }

    expect(errorMessage).to.equal(WalletError.InvalidPassword);
  });

  it('throws the correct exception when no wallet is found', async () => {

    // Remove from local storage
    if (Store.isLocalStorageSupported) {
      localStorage.removeItem(storageKeyName);
    } else {
      await new Promise<Uint8Array>(resolve => {
        fs.unlink('.' + storageKeyName, () => {
          resolve();
        });
      });
    }

    let errorMessage;
    try {
      // Attempt to retrieve a wallet that doesn't exist
      await LightWalletManager.loadWalletAsync(password, storageKeyName);
    } catch (err) {
      errorMessage = err.message;
    }

    expect(errorMessage).to.equal(WalletError.NoWalletFound);
  });
});
