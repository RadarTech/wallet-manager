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
const EthereumTx = require("ethereumjs-tx");
class CoreSigner {
    constructor(keystore, signing, pwDerivedKey) {
        this._keystore = keystore;
        this._signing = signing;
        this._pwDerivedKey = pwDerivedKey;
    }
    /**
     * Sign a personal message
     *
     * @param address The address to sign with
     * @param message The message to sign
     */
    signPersonalMessageAsync(address, message) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield this._signing.signMsg(this._keystore, this._pwDerivedKey, message, address, this._keystore.hdPathString);
                const signature = this._signing.concatSig(result);
                return signature;
            }
            catch (err) {
                throw err;
            }
        });
    }
    /**
     * Sign a transaction
     *
     * @param txParams The transaction parameters
     */
    signTransactionAsync(txParams) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const tx = new EthereumTx(txParams);
                const txHex = tx.serialize().toString('hex');
                let signedTxHex = this._signing.signTx(this._keystore, this._pwDerivedKey, txHex, txParams.from, this._keystore.hdPathString);
                signedTxHex = `0x${signedTxHex}`;
                return signedTxHex;
            }
            catch (err) {
                throw err;
            }
        });
    }
}
exports.CoreSigner = CoreSigner;
