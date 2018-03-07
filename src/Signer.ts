import * as _ from 'lodash';
import * as Web3 from 'web3';
import * as EthereumTx from 'ethereumjs-tx';
import * as lightwallet from 'eth-lightwallet';
import * as promisify from 'es6-promisify';
import Semaphore from 'semaphore-async-await';
import { assert } from '@0xproject/assert';
import { ECSignatureBuffer, PartialTxParams, JSONRPCPayload } from './types';

export class Signer {
  private _signing: any;
  private _keystore: any;
  private _pwDerivedKey: Uint8Array;
  private _nonceLock: Semaphore;
  private _engine: any;

  constructor(signing: lightwallet.signing, keystore: lightwallet.keystore, pwDerivedKey: Uint8Array) {
    this._signing = signing;
    this._keystore = keystore;
    this._pwDerivedKey = pwDerivedKey;
    this._nonceLock = new Semaphore(1);
  }


 /**
  * Set the web3 provider engine
  * 
  * @param engine The provider engine instance
  */
  public setEngine(engine: any): void {
    this._engine = engine;
  }

 /**
  * Get all accounts from the keystore instance
  * 
  */
  public getAccounts(): string[] {
    const accounts = this._keystore.getAddresses();
    return accounts;
  }

 /**
  * Sign a personal message
  * 
  * @param address The address to sign with
  * @param message The message to sign
  */
  public async signPersonalMessageAsync(address: string, message: string): Promise<string> {
    try {
      const result: ECSignatureBuffer = await this._signing.signMsg(
        this._keystore, this._pwDerivedKey, message, address, this._keystore.hdPathString);

      const r = result.r.toString('hex');
      const s = result.s.toString('hex');
      const v = result.v - 27;
      let vHex = v.toString(16);
      if (vHex.length < 2) {
          vHex = `0${v}`;
      }
      const signature = `0x${r}${s}${vHex}`;

      return signature;
    } catch (err) {
      throw err;
    }
  }

 /**
  * Send a transaction
  * 
  * @param txParams The transaction parameters
  */
  public async sendTransactionAsync(txParams: PartialTxParams): Promise<string> {
    await this._nonceLock.wait();
    try {
      // fill in the extras
      const filledParams = await this.populateMissingTxParamsAsync(txParams);

      // sign it
      const signedTx = await this.signTransactionAsync(filledParams);

      // emit a submit
      const payload = {
          method: 'eth_sendRawTransaction',
          params: [signedTx],
      };

      const result = await this.emitPayloadAsync(payload);
      this._nonceLock.signal();
      return result.result;
    } catch (err) {
      this._nonceLock.signal();
      throw err;
    }
  }
  
 /**
  * Sign a transaction
  * 
  * @param txParams The transaction parameters
  */
  private async signTransactionAsync(txParams: PartialTxParams): Promise<string> {
    try {
      const tx = new EthereumTx(txParams);
      const txHex = tx.serialize().toString('hex');
      const signedTxHex: string = this._signing.signTx(
        this._keystore, this._pwDerivedKey, txHex, txParams.from, this._keystore.hdPathString);
      
      return signedTxHex;
    } catch (err) {
      throw err;
    }
  }

 /**
  * Populate the missing transaction parameters
  * 
  * @param txParams The transaction parameters
  */
  private async populateMissingTxParamsAsync(txParams: PartialTxParams): Promise<PartialTxParams> {
    if (_.isUndefined(txParams.gasPrice)) {
      const gasPriceResult = await this.emitPayloadAsync({
          method: 'eth_gasPrice',
          params: [],
      });
      const gasPrice = gasPriceResult.result.toString();
      txParams.gasPrice = gasPrice;
    }
    if (_.isUndefined(txParams.nonce)) {
      const nonceResult = await this.emitPayloadAsync({
          method: 'eth_getTransactionCount',
          params: [txParams.from, 'pending'],
      });
      const nonce = nonceResult.result;
      txParams.nonce = nonce;
    }
    if (_.isUndefined(txParams.gas)) {
      const gasResult = await this.emitPayloadAsync({
          method: 'eth_estimateGas',
          params: [txParams],
      });
      const gas = gasResult.result.toString();
      txParams.gas = gas;
    }
    return txParams;
  }

 /**
  * Generate a random id used on the rpc request
  * 
  */
  private getRandomId() {
    const extraDigits = 3;
    // 13 time digits
    const datePart = new Date().getTime() * Math.pow(10, extraDigits);
    // 3 random digits
    const extraPart = Math.floor(Math.random() * Math.pow(10, extraDigits));
    // 16 digits
    return datePart + extraPart;
  }

 /**
  * Create the final RPC payload
  * 
  * @param payload The payload method and parameters
  */
  private createFinalPayload(payload: JSONRPCPayload): Web3.JSONRPCRequestPayload {
      const finalPayload = {
          // defaults
          id: this.getRandomId(),
          jsonrpc: '2.0',
          params: [],
          ...payload,
      };
      return finalPayload;
  }

 /**
  * Send the final RPC payload
  * 
  * @param payload The payload method and parameters
  */
  private async emitPayloadAsync(payload: JSONRPCPayload): Promise<any> {
    const finalPayload = this.createFinalPayload(payload);
    const response = await promisify(this._engine.sendAsync, this._engine)(finalPayload);
    return response;
  }
}