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
const types_1 = require("../types");
const subprovider_1 = require("./subprovider");
/*
 * This class implements the web3-provider-engine subprovider interface and forwards
 * requests involving user accounts (getAccounts, sendTransaction, etc...) to the core wallet,
 * which acts as a wrapper for eth-lightwallet.
 * Source: https://github.com/MetaMask/provider-engine/blob/master/subproviders/subprovider.js
 */
class SigningSubprovider extends subprovider_1.Subprovider {
    constructor(transactionManager) {
        super();
        this._transactionManager = transactionManager;
    }
    handleRequest(payload, next, end) {
        return __awaiter(this, void 0, void 0, function* () {
            switch (payload.method) {
                case 'eth_accounts':
                    try {
                        const accounts = this._transactionManager.getAccounts();
                        end(null, accounts);
                    }
                    catch (err) {
                        end(err);
                    }
                    return;
                case 'eth_sendTransaction':
                    try {
                        const unsignedTx = {
                            type: types_1.PayloadType.Tx,
                            params: payload.params[0]
                        };
                        const signedTx = yield this._transactionManager.signTransactionAsync(unsignedTx);
                        // emit a submit
                        const signedTxPayload = {
                            method: 'eth_sendRawTransaction',
                            params: [signedTx],
                        };
                        const result = yield this.emitPayloadAsync(signedTxPayload);
                        end(null, result);
                    }
                    catch (err) {
                        end(err);
                    }
                    return;
                case 'eth_sign':
                    try {
                        const unsignedMsg = {
                            type: types_1.PayloadType.Msg,
                            params: {
                                from: payload.params[0],
                                data: payload.params[1]
                            }
                        };
                        const result = yield this._transactionManager.signMessageAsync(unsignedMsg);
                        end(null, result);
                    }
                    catch (err) {
                        end(err);
                    }
                    return;
                default:
                    next();
                    return;
            }
        });
    }
}
exports.SigningSubprovider = SigningSubprovider;
