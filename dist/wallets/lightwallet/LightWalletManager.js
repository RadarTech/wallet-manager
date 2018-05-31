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
const _ = require("lodash");
const Store_1 = require("../../Store");
const types_1 = require("../../types");
const constants_1 = require("../../constants");
const LightWallet_1 = require("./LightWallet");
const LightWalletBase_1 = require("./LightWalletBase");
class LightWalletManager extends LightWalletBase_1.LightWalletBase {
    /**
     * Creates a new lightwallet and saves it in local storage
     *
     * @param options LightWallet initialization options
     */
    createWalletAsync(options) {
        return __awaiter(this, void 0, void 0, function* () {
            const filledOptions = this.populateMissingOptions(options);
            this.throwOnError(types_1.WalletError.StorageDisabled);
            this.validateSeedPhraseOrThrow(options.seedPhrase);
            const keystore = yield this.initializeKeystoreAsync(filledOptions);
            const pwDerivedKey = yield this.deriveKeyFromPasswordAsync(keystore, options.password);
            keystore.generateNewAddress(pwDerivedKey, 1);
            const lightWallet = new LightWallet_1.LightWallet(keystore, lightwallet.signing, pwDerivedKey);
            this.store.saveWallet(lightWallet, options.storageKeyName);
            return lightWallet;
        });
    }
    /**
     * Save the wallet
     *
     * @param {LightWallet} wallet The wallet instance
     */
    saveWallet(wallet, keyName) {
        if (wallet)
            this.store.saveWallet(wallet, keyName);
    }
    /**
     * Loads a wallet from local storage
     *
     * @param {string} password The plaintext password
     */
    loadWalletAsync(password, keyName) {
        return __awaiter(this, void 0, void 0, function* () {
            const serializedKeystore = this.store.loadWallet(keyName);
            const keystore = lightwallet.keystore.deserialize(serializedKeystore);
            const pwDerivedKey = yield this.deriveKeyFromPasswordAsync(keystore, password);
            this.validatePwDerivedKeyOrThrow(pwDerivedKey, keystore);
            return new LightWallet_1.LightWallet(keystore, lightwallet.signing, pwDerivedKey);
        });
    }
    /**
     * Initializes a new eth-lightwallet keystore
     *
     * @param {LightWalletOptions} options LightWallet initialization options
     */
    initializeKeystoreAsync(options) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise(resolve => {
                // Create LightWallet
                lightwallet.keystore.createVault(options, (err, keystore) => {
                    resolve(keystore);
                });
            });
        });
    }
    /**
     * Populate the missing wallet options
     *
     * @param {LightWalletOptions} options LightWallet initialization options
     */
    populateMissingOptions(options) {
        if (_.isUndefined(options.hdPathString)) {
            options.hdPathString = constants_1.DEFAULT_DERIVATION_PATH;
        }
        if (_.isUndefined(options.seedPhrase)) {
            options.seedPhrase = lightwallet.keystore.generateRandomSeed();
        }
        return options;
    }
    /**
     * Throw the appropriate exception on error
     *
     * @param {WalletError[]} errors An array of possible WalletErrors
     */
    throwOnError(...errors) {
        for (const error of errors) {
            switch (error) {
                case types_1.WalletError.StorageDisabled:
                    if (!Store_1.Store.IsStorageSupported())
                        throw new Error(types_1.WalletError.StorageDisabled);
                    break;
            }
        }
    }
    /**
     * Validate the seed or throw an InvalidSeed exception
     *
     * @param {string} seed The seed to validate
     */
    validateSeedPhraseOrThrow(seed) {
        const valid = lightwallet.keystore.isSeedValid(seed);
        if (!valid) {
            throw new Error(types_1.WalletError.InvalidSeed);
        }
    }
}
exports.LightWalletManager = LightWalletManager;
