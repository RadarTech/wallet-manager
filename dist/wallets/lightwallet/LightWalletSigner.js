"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var EthereumTx = require("ethereumjs-tx");
var LightWalletSigner = /** @class */ (function () {
    function LightWalletSigner(keystore, signing, pwDerivedKey) {
        this._keystore = keystore;
        this._signing = signing;
        this._pwDerivedKey = pwDerivedKey;
    }
    /**
     * Sign a personal message hash
     *
     * @param {string} account The account to sign with
     * @param {string} hash The hash to sign
     */
    LightWalletSigner.prototype.signPersonalMessageHashAsync = function (account, hash) {
        return __awaiter(this, void 0, void 0, function () {
            var result, signature, err_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this._signing.signMsgHash(this._keystore, this._pwDerivedKey, hash, account, this._keystore.hdPathString)];
                    case 1:
                        result = _a.sent();
                        signature = this._signing.concatSig(result);
                        return [2 /*return*/, signature];
                    case 2:
                        err_1 = _a.sent();
                        throw err_1;
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Sign a personal message
     *
     * @param {string} account The account to sign with
     * @param {string} message The message to sign
     */
    LightWalletSigner.prototype.signPersonalMessageAsync = function (account, message) {
        return __awaiter(this, void 0, void 0, function () {
            var result, signature, err_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this._signing.signMsg(this._keystore, this._pwDerivedKey, message, account, this._keystore.hdPathString)];
                    case 1:
                        result = _a.sent();
                        signature = this._signing.concatSig(result);
                        return [2 /*return*/, signature];
                    case 2:
                        err_2 = _a.sent();
                        throw err_2;
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Sign a transaction
     *
     * @param {PartialTxParams} txParams The transaction parameters
     */
    LightWalletSigner.prototype.signTransactionAsync = function (txParams) {
        return __awaiter(this, void 0, void 0, function () {
            var tx, txHex, signedTxHex;
            return __generator(this, function (_a) {
                try {
                    tx = new EthereumTx(txParams);
                    txHex = tx.serialize().toString('hex');
                    signedTxHex = this._signing.signTx(this._keystore, this._pwDerivedKey, txHex, txParams.from, this._keystore.hdPathString);
                    signedTxHex = "0x" + signedTxHex;
                    return [2 /*return*/, signedTxHex];
                }
                catch (err) {
                    throw err;
                }
                return [2 /*return*/];
            });
        });
    };
    return LightWalletSigner;
}());
exports.LightWalletSigner = LightWalletSigner;
