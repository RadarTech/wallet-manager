"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Web3 = require("web3");
const types_1 = require("./types");
const subproviders_1 = require("./subproviders");
const constants_1 = require("./constants");
const Web3ProviderEngine = require("web3-provider-engine");
class Web3Builder {
    constructor() {
        this._additionalSubproviders = [];
    }
    /**
     * Sets the transaction signer
     *
     * @param transactionManager The transaction manager
     */
    setSigner(transactionManager) {
        const signingSubprovider = new subproviders_1.SigningSubprovider(transactionManager);
        return this.createWeb3Object(signingSubprovider, this._currentRpcSubprovider, this._additionalSubproviders);
    }
    /**
     * Set the rpc connection
     *
     * @param connection The rpc connection url
     */
    setRpcConnection(connection) {
        const rpcSubprovider = new subproviders_1.RedundantRPCSubprovider(constants_1.PUBLIC_RPC_PROVIDER_URLS(connection));
        return this.createWeb3Object(this._currentSigningSubprovider, rpcSubprovider, this._additionalSubproviders);
    }
    /**
     * Sets both the signer and rpc connection
     *
     * @param transactionManager The transaction manager
     * @param connection The rpc connection url
     * @param subproviders Optional additional subproviders
     */
    setSignerAndRpcConnection(transactionManager, connection = types_1.InfuraNetwork.Mainnet, ...subproviders) {
        if (this.provider !== undefined) {
            this.provider.stop();
        }
        const signingSubprovider = new subproviders_1.SigningSubprovider(transactionManager);
        const rpcSubprovider = new subproviders_1.RedundantRPCSubprovider(constants_1.PUBLIC_RPC_PROVIDER_URLS(connection));
        return this.createWeb3Object(signingSubprovider, rpcSubprovider, subproviders);
    }
    /**
     * Creates the web3 object
     *
     * @param signingSubprovider The signing subprovider
     * @param rpcSubprovider The rpc subprovider
     */
    createWeb3Object(signingSubprovider, rpcSubprovider, additionalSubproviders) {
        this.provider = new Web3ProviderEngine();
        for (const subprovider of additionalSubproviders) {
            this.provider.addProvider(subprovider);
        }
        this.provider.addProvider(signingSubprovider);
        this.provider.addProvider(rpcSubprovider);
        // Unlock provider engine without block polling
        this.provider._ready.go();
        // Set current subproviders
        this._currentSigningSubprovider = signingSubprovider;
        this._currentRpcSubprovider = rpcSubprovider;
        this._additionalSubproviders = additionalSubproviders;
        return new Web3(this.provider);
    }
}
exports.Web3Builder = Web3Builder;
