"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const types_1 = require("./types");
exports.DEFAULT_DERIVATION_PATH = `m/44'/60'/0'/0`;
exports.PUBLIC_RPC_PROVIDER_URLS = (connection) => {
    switch (connection) {
        case types_1.InfuraNetwork.Mainnet:
            return [
                `https://mainnet.infura.io/radar`,
                `https://pmainnet.infura.io/radar` // TODO: ${process.env.INFURA_API_KEY}
            ];
        case types_1.InfuraNetwork.Kovan:
        case types_1.InfuraNetwork.Rinkeby:
        case types_1.InfuraNetwork.Ropsten:
            return [
                `https://${connection.toString()}.infura.io/radar` // TODO: ${process.env.INFURA_API_KEY}
            ];
        default:
            return [
                connection
            ];
    }
};
