import * as Web3 from 'web3';
import { WalletType, InfuraNetwork, WalletError, RpcConnection, TransactionManager } from './types';
import { SigningSubprovider, RedundantRPCSubprovider } from './subproviders';
import { PUBLIC_RPC_PROVIDER_URLS } from './constants';
import Web3ProviderEngine = require('web3-provider-engine');

export class Web3Builder {
  public provider: Web3ProviderEngine;
  private _currentSigningSubprovider;
  private _currentRpcSubprovider;
  private _additionalSubproviders: any[] = [];

  /**
   * Sets the transaction signer
   *
   * @param {TransactionManager} transactionManager The transaction manager
   */
  public setSigner(transactionManager: TransactionManager): Web3 {
    const signingSubprovider = new SigningSubprovider(transactionManager);
    return this.createWeb3Object(signingSubprovider, this._currentRpcSubprovider, this._additionalSubproviders);
  }

  /**
   * Set the rpc connection
   *
   * @param {RpcConnection} connection The rpc connection url
   */
  public setRpcConnection(connection: RpcConnection): Web3 {
    const rpcSubprovider = new RedundantRPCSubprovider(
      PUBLIC_RPC_PROVIDER_URLS(connection)
    );

    return this.createWeb3Object(this._currentSigningSubprovider, rpcSubprovider, this._additionalSubproviders);
  }

  /**
   * Sets both the signer and rpc connection
   *
   * @param {TransactionManager} transactionManager The transaction manager
   * @param {RpcConnection} [connection=InfuraNetwork.Mainnet] The rpc connection url
   * @param {any[]} [subproviders] Optional additional subproviders
   */
  public setSignerAndRpcConnection(
    transactionManager: TransactionManager,
    connection: RpcConnection = InfuraNetwork.Mainnet,
    ...subproviders: any[]
  ): Web3 {
    if (this.provider !== undefined) {
      this.provider.stop();
    }

    const signingSubprovider = new SigningSubprovider(transactionManager);
    const rpcSubprovider = new RedundantRPCSubprovider(
      PUBLIC_RPC_PROVIDER_URLS(connection)
    );

    return this.createWeb3Object(signingSubprovider, rpcSubprovider, subproviders);
  }

  /**
   * Creates the web3 object
   *
   * @param {SigningSubprovider} signingSubprovider The signing subprovider
   * @param {RedundantRPCSubprovider} rpcSubprovider The rpc subprovider
   * @param {any[]} [additionalSubproviders] Additional subproviders
   */
  private createWeb3Object(
    signingSubprovider: SigningSubprovider,
    rpcSubprovider: RedundantRPCSubprovider,
    additionalSubproviders?: any[]
  ): Web3 {
    this.provider = new Web3ProviderEngine();

    for (const subprovider of additionalSubproviders) {
      this.provider.addProvider(subprovider);
    }

    this.provider.addProvider(signingSubprovider);
    this.provider.addProvider(rpcSubprovider);

    // Unlock provider engine without block polling
    (this.provider as any)._ready.go();

    // Set current subproviders
    this._currentSigningSubprovider = signingSubprovider;
    this._currentRpcSubprovider = rpcSubprovider;
    this._additionalSubproviders = additionalSubproviders;

    return new Web3(this.provider);
  }
}
