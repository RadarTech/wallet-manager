import * as mocha from 'mocha';
import * as chai from 'chai';
import { VaultManager } from '../src/VaultManager';
import { VaultError } from '../src/types';

const expect = chai.expect;

/* tslint:disable:no-unused-expression */
describe('VaultManager', () => {
    const password = 'supersecretpassword99';

    it('can create a new vault', async () => {
        const vaultManager = new VaultManager();
        await vaultManager.createVault({ password });

        // Export the recovery phrase
        const recoveryPhrase = vaultManager.exportRecoveryPhrase();

        // Get Vault Addresses
        const addresses = vaultManager.getAddresses();

        // Recovery phrase should be 12 words
        expect(recoveryPhrase.split(' ').length).to.equal(12);

        // Vault should contain 1 address
        expect(addresses.length).to.equal(1);
    });

    it('can save and load a vault from local storage', async () => {
        const vaultManager = new VaultManager();
        await vaultManager.createVault({ password });

        // Remove the vault from memory
        vaultManager.lockVault();

        // Reload the vault from local storage
        await vaultManager.unlockVault(password);

        // Export the recovery phrase
        const recoveryPhrase = vaultManager.exportRecoveryPhrase();

        // Get Vault Addresses
        const addresses = vaultManager.getAddresses();

        // Recovery phrase should be 12 words
        expect(recoveryPhrase.split(' ').length).to.equal(12);

        // Vault should contain 1 address
        expect(addresses.length).to.equal(1);
    });

    it('can export the private key of an account', async () => {
        const vaultManager = new VaultManager();
        await vaultManager.createVault({ password });

        // Export the private key of the first account
        const privateKey = vaultManager.exportAccountPrivateKey(vaultManager.getAddresses()[0]);

        // Private key should be 
        expect(privateKey.length).to.equal(64);
    });

    it('throws the correct exception when no vault is found', async () => {
        const vaultManager = new VaultManager();

        let errorMessage;
        try {
            // Attempt to add address without vault
            vaultManager.addNewAddresses(1);
        } catch(err) {
            errorMessage = err;
        }

        expect(errorMessage).to.equal(VaultError.NoVaultFound);
    });
});
