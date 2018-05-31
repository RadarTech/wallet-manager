"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// Main
var WalletManager_1 = require("./WalletManager"); // TODO: Delete this unless it serves an additional purpose.
exports.WalletManager = WalletManager_1.WalletManager;
// Wallets
var lightwallet_1 = require("./wallets/lightwallet");
exports.LightWalletManager = lightwallet_1.LightWalletManager;
