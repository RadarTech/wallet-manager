import * as Web3 from 'web3';
import { WalletType, InfuraNetwork, WalletError, RpcConnection, TransactionManager } from "./types";
import { PUBLIC_RPC_PROVIDER_URLS } from './constants';
import {
  ledgerEthereumBrowserClientFactoryAsync as ledgerEthereumClientFactoryAsync,
  LedgerSubproviderConfigs,
  LedgerSubprovider,
  RedundantRPCSubprovider,
  SigningSubprovider
} from 'subproviders';
import Web3ProviderEngine = require('web3-provider-engine');

export class Web3Builder {
  private _currentSigningSubprovider;
  private _currentRpcSubprovider;
  public provider: Web3ProviderEngine;

  /**
   * Sets the transaction signer
   * 
   * @param transactionManager The transaction manager
   */
  public setSigner(transactionManager: TransactionManager): Web3 {
    if (this.provider !== undefined) {
      this.provider.stop();
    }

    const signingSubprovider = new SigningSubprovider(transactionManager);
    return this.createWeb3Object(signingSubprovider, this._currentRpcSubprovider);
  }

  /**
   * Set the rpc connection
   * 
   * @param connection The rpc connection url
   */
  public setRpcConnection(connection: RpcConnection): Web3 {
    if (this.provider !== undefined) {
      this.provider.stop();
    }

    const rpcSubprovider = new RedundantRPCSubprovider(
      PUBLIC_RPC_PROVIDER_URLS(connection)
    );

    return this.createWeb3Object(this._currentSigningSubprovider, rpcSubprovider);
  }

  /**
   * Sets both the signer and rpc connection
   * 
   * @param transactionManager The transaction manager
   * @param connection The rpc connection url
   */
  public setSignerAndRpcConnection(transactionManager: TransactionManager, connection: RpcConnection = InfuraNetwork.Mainnet): Web3 {
    if (this.provider !== undefined) {
      this.provider.stop();
    }

    const signingSubprovider = new SigningSubprovider(transactionManager);
    const rpcSubprovider = new RedundantRPCSubprovider(
      PUBLIC_RPC_PROVIDER_URLS(connection)
    );

    return this.createWeb3Object(signingSubprovider, rpcSubprovider);
  }

  /**
   * Creates the web3 object
   * 
   * @param signingSubprovider The signing subprovider
   * @param rpcSubprovider The rpc subprovider
   */
  private createWeb3Object(signingSubprovider: SigningSubprovider, rpcSubprovider: RedundantRPCSubprovider): Web3 {
    this.provider = new Web3ProviderEngine();
    this.provider.addProvider(signingSubprovider);
    this.provider.addProvider(rpcSubprovider);
    this.provider.start();

    // Set current subproviders
    this._currentSigningSubprovider = signingSubprovider;
    this._currentRpcSubprovider = rpcSubprovider;

    return new Web3(this.provider);
  }
}