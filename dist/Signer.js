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
const EthereumTx = require("ethereumjs-tx");
const promisify = require("es6-promisify");
const semaphore_async_await_1 = require("semaphore-async-await");
class Signer {
    constructor(signing, keystore, pwDerivedKey) {
        this._signing = signing;
        this._keystore = keystore;
        this._pwDerivedKey = pwDerivedKey;
        this._nonceLock = new semaphore_async_await_1.default(1);
    }
    /**
     * Set the web3 provider engine
     *
     * @param engine The provider engine instance
     */
    setEngine(engine) {
        this._engine = engine;
    }
    /**
     * Get all accounts from the keystore instance
     *
     */
    getAccounts() {
        const accounts = this._keystore.getAddresses();
        return accounts;
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
                const r = result.r.toString('hex');
                const s = result.s.toString('hex');
                const v = result.v - 27;
                let vHex = v.toString(16);
                if (vHex.length < 2) {
                    vHex = `0${v}`;
                }
                const signature = `0x${r}${s}${vHex}`;
                return signature;
            }
            catch (err) {
                throw err;
            }
        });
    }
    /**
     * Send a transaction
     *
     * @param txParams The transaction parameters
     */
    sendTransactionAsync(txParams) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this._nonceLock.wait();
            try {
                // fill in the extras
                const filledParams = yield this.populateMissingTxParamsAsync(txParams);
                // sign it
                const signedTx = yield this.signTransactionAsync(filledParams);
                // emit a submit
                const payload = {
                    method: 'eth_sendRawTransaction',
                    params: [signedTx],
                };
                const result = yield this.emitPayloadAsync(payload);
                this._nonceLock.signal();
                return result.result;
            }
            catch (err) {
                this._nonceLock.signal();
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
                const signedTxHex = this._signing.signTx(this._keystore, this._pwDerivedKey, txHex, txParams.from, this._keystore.hdPathString);
                return signedTxHex;
            }
            catch (err) {
                throw err;
            }
        });
    }
    /**
     * Populate the missing transaction parameters
     *
     * @param txParams The transaction parameters
     */
    populateMissingTxParamsAsync(txParams) {
        return __awaiter(this, void 0, void 0, function* () {
            if (_.isUndefined(txParams.gasPrice)) {
                const gasPriceResult = yield this.emitPayloadAsync({
                    method: 'eth_gasPrice',
                    params: [],
                });
                const gasPrice = gasPriceResult.result.toString();
                txParams.gasPrice = gasPrice;
            }
            if (_.isUndefined(txParams.nonce)) {
                const nonceResult = yield this.emitPayloadAsync({
                    method: 'eth_getTransactionCount',
                    params: [txParams.from, 'pending'],
                });
                const nonce = nonceResult.result;
                txParams.nonce = nonce;
            }
            if (_.isUndefined(txParams.gas)) {
                const gasResult = yield this.emitPayloadAsync({
                    method: 'eth_estimateGas',
                    params: [txParams],
                });
                const gas = gasResult.result.toString();
                txParams.gas = gas;
            }
            return txParams;
        });
    }
    /**
     * Generate a random id used on the rpc request
     *
     */
    getRandomId() {
        const extraDigits = 3;
        // 13 time digits
        const datePart = new Date().getTime() * Math.pow(10, extraDigits);
        // 3 random digits
        const extraPart = Math.floor(Math.random() * Math.pow(10, extraDigits));
        // 16 digits
        return datePart + extraPart;
    }
    /**
     * Create the final RPC payload
     *
     * @param payload The payload method and parameters
     */
    createFinalPayload(payload) {
        const finalPayload = Object.assign({ 
            // defaults
            id: this.getRandomId(), jsonrpc: '2.0', params: [] }, payload);
        return finalPayload;
    }
    /**
     * Send the final RPC payload
     *
     * @param payload The payload method and parameters
     */
    emitPayloadAsync(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            const finalPayload = this.createFinalPayload(payload);
            const response = yield promisify(this._engine.sendAsync, this._engine)(finalPayload);
            return response;
        });
    }
}
exports.Signer = Signer;
