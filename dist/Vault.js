"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Vault {
    constructor(keystore, signing, pwDerivedKey) {
        this.keystore = keystore;
        this.signing = signing;
        this.pwDerivedKey = pwDerivedKey;
    }
}
exports.Vault = Vault;
