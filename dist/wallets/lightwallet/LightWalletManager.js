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
var lightwallet = require("eth-lightwallet");
var _ = require("lodash");
var Store_1 = require("../../Store");
var types_1 = require("../../types");
var constants_1 = require("../../constants");
var LightWallet_1 = require("./LightWallet");
var LightWalletUtils_1 = require("./LightWalletUtils");
var LightWalletManager = /** @class */ (function () {
    function LightWalletManager() {
    }
    /**
     * Creates a new lightwallet and saves it in local storage
     *
     * @param options LightWallet initialization options
     */
    LightWalletManager.createWalletAsync = function (options) {
        return __awaiter(this, void 0, void 0, function () {
            var filledOptions, keystore, pwDerivedKey, lightWallet;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        filledOptions = this.populateMissingOptions(options);
                        this.throwOnError(types_1.WalletError.StorageDisabled);
                        this.validateSeedPhraseOrThrow(options.seedPhrase);
                        return [4 /*yield*/, this.initializeKeystoreAsync(filledOptions)];
                    case 1:
                        keystore = _a.sent();
                        return [4 /*yield*/, LightWalletUtils_1.LightWalletUtils.deriveKeyFromPasswordAsync(keystore, options.password)];
                    case 2:
                        pwDerivedKey = _a.sent();
                        keystore.generateNewAddress(pwDerivedKey, 1);
                        lightWallet = new LightWallet_1.LightWallet(keystore, lightwallet.signing, pwDerivedKey);
                        Store_1.Store.saveWallet(lightWallet, options.storageKeyName);
                        return [2 /*return*/, lightWallet];
                }
            });
        });
    };
    /**
     * Save the wallet
     *
     * @param {LightWallet} wallet The wallet instance
     */
    LightWalletManager.saveWallet = function (wallet, keyName) {
        if (wallet)
            Store_1.Store.saveWallet(wallet, keyName);
    };
    /**
     * Loads a wallet from local storage
     *
     * @param {string} password The plaintext password
     */
    LightWalletManager.loadWalletAsync = function (password, keyName) {
        return __awaiter(this, void 0, void 0, function () {
            var serializedKeystore, keystore, pwDerivedKey;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        serializedKeystore = Store_1.Store.loadWallet(keyName);
                        keystore = lightwallet.keystore.deserialize(serializedKeystore);
                        return [4 /*yield*/, LightWalletUtils_1.LightWalletUtils.deriveKeyFromPasswordAsync(keystore, password)];
                    case 1:
                        pwDerivedKey = _a.sent();
                        LightWalletUtils_1.LightWalletUtils.validatePwDerivedKeyOrThrow(pwDerivedKey, keystore);
                        return [2 /*return*/, new LightWallet_1.LightWallet(keystore, lightwallet.signing, pwDerivedKey)];
                }
            });
        });
    };
    /**
     * Initializes a new eth-lightwallet keystore
     *
     * @param {LightWalletOptions} options LightWallet initialization options
     */
    LightWalletManager.initializeKeystoreAsync = function (options) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, new Promise(function (resolve) {
                        // Create LightWallet
                        lightwallet.keystore.createVault(options, function (err, keystore) {
                            resolve(keystore);
                        });
                    })];
            });
        });
    };
    /**
     * Populate the missing wallet options
     *
     * @param {LightWalletOptions} options LightWallet initialization options
     */
    LightWalletManager.populateMissingOptions = function (options) {
        if (_.isUndefined(options.hdPathString)) {
            options.hdPathString = constants_1.DEFAULT_DERIVATION_PATH;
        }
        if (_.isUndefined(options.seedPhrase)) {
            options.seedPhrase = lightwallet.keystore.generateRandomSeed();
        }
        return options;
    };
    /**
     * Throw the appropriate exception on error
     *
     * @param {WalletError[]} errors An array of possible WalletErrors
     */
    LightWalletManager.throwOnError = function () {
        var errors = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            errors[_i] = arguments[_i];
        }
        for (var _a = 0, errors_1 = errors; _a < errors_1.length; _a++) {
            var error = errors_1[_a];
            switch (error) {
                case types_1.WalletError.StorageDisabled:
                    if (!Store_1.Store.isStorageSupported())
                        throw new Error(types_1.WalletError.StorageDisabled);
                    break;
            }
        }
    };
    /**
     * Validate the seed or throw an InvalidSeed exception
     *
     * @param {string} seed The seed to validate
     */
    LightWalletManager.validateSeedPhraseOrThrow = function (seed) {
        var valid = lightwallet.keystore.isSeedValid(seed);
        if (!valid) {
            throw new Error(types_1.WalletError.InvalidSeed);
        }
    };
    return LightWalletManager;
}());
exports.LightWalletManager = LightWalletManager;
