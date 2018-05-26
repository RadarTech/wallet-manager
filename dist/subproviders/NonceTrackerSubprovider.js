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
const _ = require("lodash");
const types_1 = require("@0xproject/types");
const EthereumTx = require("ethereumjs-tx");
const ethUtil = require("ethereumjs-util");
const providerEngineUtils = require("web3-provider-engine/util/rpc-cache-utils");
const types_2 = require("../types");
const subprovider_1 = require("./subprovider");
const NONCE_TOO_LOW_ERROR_MESSAGE = 'Transaction nonce is too low';
/**
 * This class implements the [web3-provider-engine](https://github.com/MetaMask/provider-engine) subprovider interface.
 * It is heavily inspired by the
 * [NonceSubprovider](https://github.com/MetaMask/provider-engine/blob/master/subproviders/nonce-tracker.js).
 * We added the additional feature of clearing the cached nonce value when a `nonce value too low` error occurs.
 */
class NonceTrackerSubprovider extends subprovider_1.Subprovider {
    constructor() {
        super(...arguments);
        this._nonceCache = {};
    }
    static _reconstructTransaction(payload) {
        const raw = payload.params[0];
        if (_.isUndefined(raw)) {
            throw new Error(types_2.NonceSubproviderErrors.EmptyParametersFound);
        }
        const rawData = ethUtil.toBuffer(raw);
        const transaction = new EthereumTx(rawData);
        return transaction;
    }
    static _determineAddress(payload) {
        let address;
        switch (payload.method) {
            case 'eth_getTransactionCount':
                address = payload.params[0].toLowerCase();
                return address;
            case 'eth_sendRawTransaction':
                const transaction = NonceTrackerSubprovider._reconstructTransaction(payload);
                const addressRaw = transaction
                    .getSenderAddress()
                    .toString('hex')
                    .toLowerCase();
                address = `0x${addressRaw}`;
                return address;
            default:
                throw new Error(types_2.NonceSubproviderErrors.CannotDetermineAddressFromPayload);
        }
    }
    /**
     * This method conforms to the web3-provider-engine interface.
     * It is called internally by the ProviderEngine when it is this subproviders
     * turn to handle a JSON RPC request.
     * @param payload JSON RPC payload
     * @param next Callback to call if this subprovider decides not to handle the request
     * @param end Callback to call if subprovider handled the request and wants to pass back the request.
     */
    // tslint:disable-next-line:async-suffix
    handleRequest(payload, next, end) {
        return __awaiter(this, void 0, void 0, function* () {
            switch (payload.method) {
                case 'eth_getTransactionCount':
                    const requestDefaultBlock = providerEngineUtils.blockTagForPayload(payload);
                    if (requestDefaultBlock === types_1.BlockParamLiteral.Pending) {
                        const address = NonceTrackerSubprovider._determineAddress(payload);
                        const cachedResult = this._nonceCache[address];
                        if (!_.isUndefined(cachedResult)) {
                            return end(null, cachedResult);
                        }
                        else {
                            return next((requestError, requestResult, cb) => {
                                if (_.isNull(requestError)) {
                                    this._nonceCache[address] = requestResult;
                                }
                                cb();
                            });
                        }
                    }
                    else {
                        return next();
                    }
                case 'eth_sendRawTransaction':
                    return next((sendTransactionError, txResult, cb) => {
                        if (_.isNull(sendTransactionError)) {
                            this._handleSuccessfulTransaction(payload);
                        }
                        else {
                            this._handleSendTransactionError(payload, sendTransactionError);
                        }
                        cb();
                    });
                default:
                    return next();
            }
        });
    }
    _handleSuccessfulTransaction(payload) {
        const address = NonceTrackerSubprovider._determineAddress(payload);
        const transaction = NonceTrackerSubprovider._reconstructTransaction(payload);
        // Increment the nonce from the previous successfully submitted transaction
        let nonce = ethUtil.bufferToInt(transaction.nonce);
        nonce++;
        let nextHexNonce = nonce.toString(16);
        if (nextHexNonce.length % 2) {
            nextHexNonce = `0${nextHexNonce}`;
        }
        const nextPrefixedHexNonce = `0x${nextHexNonce}`;
        this._nonceCache[address] = nextPrefixedHexNonce;
    }
    _handleSendTransactionError(payload, err) {
        const address = NonceTrackerSubprovider._determineAddress(payload);
        if (this._nonceCache[address] && _.includes(err.message, NONCE_TOO_LOW_ERROR_MESSAGE)) {
            delete this._nonceCache[address];
        }
    }
}
exports.NonceTrackerSubprovider = NonceTrackerSubprovider;
