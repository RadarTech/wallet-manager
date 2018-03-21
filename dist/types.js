"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var WalletError;
(function (WalletError) {
    WalletError["LocalStorageDisabled"] = "LOCAL_STORAGE_DISABLED";
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
    InfuraNetwork[InfuraNetwork["Mainnet"] = 0] = "Mainnet";
    InfuraNetwork[InfuraNetwork["Kovan"] = 1] = "Kovan";
    InfuraNetwork[InfuraNetwork["Rinkeby"] = 2] = "Rinkeby";
    InfuraNetwork[InfuraNetwork["Ropsten"] = 3] = "Ropsten";
})(InfuraNetwork = exports.InfuraNetwork || (exports.InfuraNetwork = {}));
