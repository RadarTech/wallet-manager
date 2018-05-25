import * as Web3 from 'web3';
import { RpcConnection, TransactionManager } from './types';
import Web3ProviderEngine = require('web3-provider-engine');
export declare class Web3Builder {
    provider: Web3ProviderEngine;
    private _currentSigningSubprovider;
    private _currentRpcSubprovider;
    private _additionalSubproviders;
    /**
     * Sets the transaction signer
     *
     * @param {TransactionManager} transactionManager The transaction manager
     */
    setSigner(transactionManager: TransactionManager): Web3;
    /**
     * Set the rpc connection
     *
     * @param {RpcConnection} connection The rpc connection url
     */
    setRpcConnection(connection: RpcConnection): Web3;
    /**
     * Sets both the signer and rpc connection
     *
     * @param {TransactionManager} transactionManager The transaction manager
     * @param {RpcConnection} [connection=InfuraNetwork.Mainnet] The rpc connection url
     * @param {any[]} [subproviders] Optional additional subproviders
     */
    setSignerAndRpcConnection(transactionManager: TransactionManager, connection?: RpcConnection, ...subproviders: any[]): Web3;
    /**
     * Creates the web3 object
     *
     * @param {SigningSubprovider} signingSubprovider The signing subprovider
     * @param {RedundantRPCSubprovider} rpcSubprovider The rpc subprovider
     * @param {any[]} [additionalSubproviders] Additional subproviders
     */
    private createWeb3Object(signingSubprovider, rpcSubprovider, additionalSubproviders?);
}
