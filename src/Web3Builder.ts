import * as Web3 from 'web3';
import { WalletType, InfuraNetwork, WalletError, RpcConnection, TransactionManager } from './types';
import { PassThroughSigningSubprovider, NonceTrackerSubprovider, RedundantRPCSubprovider } from './subproviders';
import { PUBLIC_RPC_PROVIDER_URLS } from './constants';
import Web3ProviderEngine = require('web3-provider-engine');

export class Web3Builder {
  public provider: Web3ProviderEngine;
  private _currentPassThroughSigningSubprovider: PassThroughSigningSubprovider;
  private _currentRpcSubprovider: RedundantRPCSubprovider;
  private _cacheNonce: boolean;

  /**
   * Creates a new web3 instance
   *
   * @param {TransactionManager} transactionManager The transaction manager
   * @param {RpcConnection} [connection=InfuraNetwork.Mainnet] The rpc connection
   * @param {boolean} [cacheNonce] Cache the nonce
   */
  public createWeb3(
    transactionManager: TransactionManager,
    connection: RpcConnection = InfuraNetwork.Mainnet,
    cacheNonce?: boolean
  ): Web3 {
    const signingSubprovider = new PassThroughSigningSubprovider(transactionManager);
    const rpcSubprovider = new RedundantRPCSubprovider(
      PUBLIC_RPC_PROVIDER_URLS(connection)
    );

    return this.constructWeb3Object(signingSubprovider, rpcSubprovider, cacheNonce);
  }

  /**
   * Sets the transaction signer
   *
   * @param {TransactionManager} transactionManager The transaction manager
   */
  public updateSigner(transactionManager: TransactionManager): Web3 {
    const signingSubprovider = new PassThroughSigningSubprovider(transactionManager);

    return this.constructWeb3Object(
      signingSubprovider,
      this._currentRpcSubprovider,
      this._cacheNonce
    );
  }

  /**
   * Set the rpc connection
   *
   * @param {RpcConnection} connection The rpc connection url
   */
  public updateRpcConnection(connection: RpcConnection): Web3 {
    const rpcSubprovider = new RedundantRPCSubprovider(
      PUBLIC_RPC_PROVIDER_URLS(connection)
    );

    return this.constructWeb3Object(
      this._currentPassThroughSigningSubprovider,
      rpcSubprovider,
      this._cacheNonce
    );
  }

  /**
   * Constructs the web3 object
   *
   * @param {PassThroughSigningSubprovider} signingSubprovider The signing subprovider
   * @param {RedundantRPCSubprovider} rpcSubprovider The rpc subprovider
   * @param {boolean} [cacheNonce] Cache the nonce with the nonce tracker subprovider
   */
  private constructWeb3Object(
    signingSubprovider: PassThroughSigningSubprovider,
    rpcSubprovider: RedundantRPCSubprovider,
    cacheNonce?: boolean
  ): Web3 {
    this.provider = new Web3ProviderEngine();

    if (cacheNonce) {
      this.provider.addProvider(new NonceTrackerSubprovider());
    }

    this.provider.addProvider(signingSubprovider);
    this.provider.addProvider(rpcSubprovider);

    // Unlock provider engine without block polling
    (this.provider as any)._ready.go();

    // Set current subproviders
    this._currentPassThroughSigningSubprovider = signingSubprovider;
    this._currentRpcSubprovider = rpcSubprovider;
    this._cacheNonce = cacheNonce;

    return new Web3(this.provider);
  }
}
