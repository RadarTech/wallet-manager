"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var PayloadType;
(function (PayloadType) {
    PayloadType[PayloadType["Tx"] = 0] = "Tx";
    PayloadType[PayloadType["Msg"] = 1] = "Msg";
    PayloadType[PayloadType["PersonalMsg"] = 2] = "PersonalMsg";
})(PayloadType = exports.PayloadType || (exports.PayloadType = {}));
var WalletError;
(function (WalletError) {
    WalletError["StorageDisabled"] = "STORAGE_DISABLED";
    WalletError["NoWalletFound"] = "NO_WALLET_FOUND";
    WalletError["InvalidSeed"] = "INVALID_SEED";
    WalletError["InvalidPassword"] = "INVALID_PASSWORD";
})(WalletError = exports.WalletError || (exports.WalletError = {}));
var SigningError;
(function (SigningError) {
    SigningError["UserDeclined"] = "USER_DECLINED";
})(SigningError = exports.SigningError || (exports.SigningError = {}));
var WalletType;
(function (WalletType) {
    WalletType[WalletType["Core"] = 0] = "Core";
    WalletType[WalletType["Ledger"] = 1] = "Ledger";
})(WalletType = exports.WalletType || (exports.WalletType = {}));
var InfuraNetwork;
(function (InfuraNetwork) {
    InfuraNetwork["Mainnet"] = "mainnet";
    InfuraNetwork["Kovan"] = "kovan";
    InfuraNetwork["Rinkeby"] = "rinkeby";
    InfuraNetwork["Ropsten"] = "ropsten";
})(InfuraNetwork = exports.InfuraNetwork || (exports.InfuraNetwork = {}));
var NonceSubproviderErrors;
(function (NonceSubproviderErrors) {
    NonceSubproviderErrors["EmptyParametersFound"] = "EMPTY_PARAMETERS_FOUND";
    NonceSubproviderErrors["CannotDetermineAddressFromPayload"] = "CANNOT_DETERMINE_ADDRESS_FROM_PAYLOAD";
})(NonceSubproviderErrors = exports.NonceSubproviderErrors || (exports.NonceSubproviderErrors = {}));
