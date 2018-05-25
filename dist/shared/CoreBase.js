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
const Store_1 = require("../Store");
const types_1 = require("../types");
class CoreBase {
    constructor() {
        this.store = new Store_1.Store();
    }
    /**
     * Derives a symmetric key from the plaintext password and salt
     *
     * @param {keystore} keystore The wallet's keystore instance
     * @param {string} password The plaintext password
     */
    deriveKeyFromPasswordAsync(keystore, password) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise(resolve => {
                keystore.keyFromPassword(password, (err, pwDerivedKey) => {
                    resolve(pwDerivedKey);
                });
            });
        });
    }
    /**
     * Validate the pwDerivedKey or throw an InvalidPassword exception
     *
     * @param {Uint8Array} pwDerivedKey The password derived symmetric key
     * @param {keystore} keystore The lightwallet keystore
     */
    validatePwDerivedKeyOrThrow(pwDerivedKey, keystore) {
        const valid = keystore.isDerivedKeyCorrect(pwDerivedKey);
        if (!valid) {
            throw new Error(types_1.WalletError.InvalidPassword);
        }
    }
}
exports.CoreBase = CoreBase;
