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
const LightWalletSigner_1 = require("./LightWalletSigner");
const types_1 = require("../../types");
const LightWalletBase_1 = require("./LightWalletBase");
class LightWallet extends LightWalletBase_1.LightWalletBase {
    constructor(keystore, signing, pwDerivedKey) {
        super();
        this.keystore = keystore;
        this.signing = signing;
        this.pwDerivedKey = pwDerivedKey;
        this.type = types_1.WalletType.LightWallet;
        this.signer = new LightWalletSigner_1.LightWalletSigner(keystore, signing, pwDerivedKey);
    }
    /**
     * Adds one or more accounts to the wallet
     *
     * @param {number} [numberOfAccounts=1] The number of accounts to add
     */
    addNewAccounts(numberOfAccounts = 1) {
        this.keystore.generateNewAddress(this.pwDerivedKey, numberOfAccounts);
        this.store.saveWallet(this);
    }
    /**
     * Gets all the accounts from the wallet
     *
     */
    getAccounts() {
        const accounts = this.keystore.getAddresses();
        return accounts;
    }
    /**
     * Serialize the wallet keystore
     *
     */
    serialize() {
        return this.keystore.serialize();
    }
    /**
     * Exports the wallet's seed phrase
     *
     * @param {string} password The plaintext password
     */
    exportSeedPhraseAsync(password) {
        return __awaiter(this, void 0, void 0, function* () {
            const pwDerivedKey = yield this.deriveKeyFromPasswordAsync(this.keystore, password);
            this.validatePwDerivedKeyOrThrow(pwDerivedKey, this.keystore);
            return this.keystore.getSeed(pwDerivedKey);
        });
    }
    /**
     * Exports the private key for a single account
     *
     * @param {string} account The account used for the export
     * @param {string} password The plaintext password
     */
    exportAccountPrivateKeyAsync(account, password) {
        return __awaiter(this, void 0, void 0, function* () {
            const pwDerivedKey = yield this.deriveKeyFromPasswordAsync(this.keystore, password);
            this.validatePwDerivedKeyOrThrow(pwDerivedKey, this.keystore);
            return this.keystore.exportPrivateKey(account, pwDerivedKey);
        });
    }
}
exports.LightWallet = LightWallet;
