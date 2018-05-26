import * as Web3 from 'web3';
import { RpcConnection, TransactionManager } from './types';
import Web3ProviderEngine = require('web3-provider-engine');
export declare class Web3Builder {
    provider: Web3ProviderEngine;
    private _currentPassThroughSigningSubprovider;
    private _currentRpcSubprovider;
    private _cacheNonce;
    /**
     * Creates a new web3 instance
     *
     * @param {TransactionManager} transactionManager The transaction manager
     * @param {RpcConnection} [connection=InfuraNetwork.Mainnet] The rpc connection
     * @param {boolean} [cacheNonce] Cache the nonce
     */
    createWeb3(transactionManager: TransactionManager, connection?: RpcConnection, cacheNonce?: boolean): Web3;
    /**
     * Sets the transaction signer
     *
     * @param {TransactionManager} transactionManager The transaction manager
     */
    updateSigner(transactionManager: TransactionManager): Web3;
    /**
     * Set the rpc connection
     *
     * @param {RpcConnection} connection The rpc connection url
     */
    updateRpcConnection(connection: RpcConnection): Web3;
    /**
     * Constructs the web3 object
     *
     * @param {PassThroughSigningSubprovider} signingSubprovider The signing subprovider
     * @param {RedundantRPCSubprovider} rpcSubprovider The rpc subprovider
     * @param {boolean} [cacheNonce] Cache the nonce with the nonce tracker subprovider
     */
    private constructWeb3Object(signingSubprovider, rpcSubprovider, cacheNonce?);
}
