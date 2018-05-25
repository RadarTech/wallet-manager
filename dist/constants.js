"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const types_1 = require("./types");
exports.DEFAULT_DERIVATION_PATH = `m/44'/60'/0'/0`;
exports.INFURA_API_KEY = ''; // Set API key (if applicable)
exports.PUBLIC_RPC_PROVIDER_URLS = (connection) => {
    switch (connection) {
        case types_1.InfuraNetwork.Mainnet:
            return [
                `https://mainnet.infura.io/${exports.INFURA_API_KEY}`,
                `https://pmainnet.infura.io/${exports.INFURA_API_KEY}`
            ];
        case types_1.InfuraNetwork.Kovan:
        case types_1.InfuraNetwork.Rinkeby:
        case types_1.InfuraNetwork.Ropsten:
            return [
                `https://${connection.toString()}.infura.io/${exports.INFURA_API_KEY}`
            ];
        default:
            return [
                connection
            ];
    }
};
