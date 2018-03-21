import * as Web3 from 'web3';
import { RpcConnection, TransactionManager } from "./types";
import Web3ProviderEngine = require('web3-provider-engine');
export declare class Web3Builder {
    private _currentSigningSubprovider;
    private _currentRpcSubprovider;
    provider: Web3ProviderEngine;
    /**
     * Sets the transaction signer
     *
     * @param transactionManager The transaction manager
     */
    setSigner(transactionManager: TransactionManager): Web3;
    /**
     * Set the rpc connection
     *
     * @param connection The rpc connection url
     */
    setRpcConnection(connection: RpcConnection): Web3;
    /**
     * Sets both the signer and rpc connection
     *
     * @param transactionManager The transaction manager
     * @param connection The rpc connection url
     */
    setSignerAndConnection(transactionManager: TransactionManager, connection?: RpcConnection): Web3;
    /**
     * Adds one or more addresses to the wallet
     *
     * @param signingSubprovider The signing subprovider
     * @param rpcSubprovider The rpc subprovider
     */
    private createWeb3Object(signingSubprovider, rpcSubprovider);
}
