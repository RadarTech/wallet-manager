"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const lightwallet = require("eth-lightwallet");
const Store_1 = require("./Store");
const Vault_1 = require("./Vault");
const constants_1 = require("./constants");
class VaultManager {
    constructor() {
        this._store = new Store_1.Store();
    }
    /**
     * Creates a new vault and saves it in local storage
     *
     * @param options Vault initialization options
     */
    createVault(options) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!options.hdPathString)
                options.hdPathString = constants_1.DEFAULT_DERIVATION_PATH;
            if (!this._store.isLocalStorageSupported())
                throw 'blep';
            const keystore = yield this.initializeKeystore(options);
            const pwDerivedKey = yield this.deriveKeyFromPassword(keystore, options.password);
            this._vault = new Vault_1.Vault(keystore, lightwallet.signing, pwDerivedKey);
            this._store.saveVault(this._vault);
        });
    }
    /**
     * Save the vault and remove it from memory
     *
     */
    lockVault() {
        if (this._vault)
            this._store.saveVault(this._vault);
        this._vault = null;
    }
    /**
     * Loads a vault from local storage
     *
     * @param password The plaintext password
     */
    unlockVault(password) {
        return __awaiter(this, void 0, void 0, function* () {
            const keystore = this._store.loadVault();
            if (keystore) {
                const pwDerivedKey = yield this.deriveKeyFromPassword(keystore, password);
                this._vault = new Vault_1.Vault(keystore, lightwallet.signing, pwDerivedKey);
                return true;
            }
            return false;
        });
    }
    /**
     * Adds one or more addresses to the vault
     *
     */
    addNewAddresses(numberOfAddresses = 1) {
        this._vault.keystore.generateNewAddress(this._vault.pwDerivedKey, numberOfAddresses);
        this._store.saveVault(this._vault);
    }
    /**
     * Exports the vault's recovery phrase
     *
     */
    exportRecoveryPhrase() {
        return this._vault.keystore.getSeed(this._vault.pwDerivedKey);
    }
    /**
     * Exports the private key for a single account
     *
     */
    exportAccountPrivateKey(address) {
        return this._vault.keystore.exportPrivateKey(address, this._vault.pwDerivedKey);
    }
    /**
     * Initializes a new eth-lightwallet keystore
     *
     * @param options Vault initialization options
     */
    initializeKeystore(options) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve) => {
                // Create Vault
                lightwallet.keystore.createVault(options, (err, keystore) => {
                    resolve(keystore);
                });
            });
        });
    }
    /**
     * Derives a symmetric key from the plaintext password and salt
     *
     * @param keystore The vault's keystore instance
     * @param password The plaintext password
     */
    deriveKeyFromPassword(keystore, password) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve) => {
                keystore.keyFromPassword(password, (err, pwDerivedKey) => {
                    resolve(pwDerivedKey);
                });
            });
        });
    }
}
exports.VaultManager = VaultManager;
