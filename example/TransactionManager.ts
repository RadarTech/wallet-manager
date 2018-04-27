import * as _ from 'lodash';
import { EventEmitter } from 'events';
import { TransactionManager, Signer, PayloadType, PartialTxParams, UnsignedPayload, SigningError, Wallet } from "../src/types";
import { promisify, BigNumber } from '@0xproject/utils';
import { Web3 } from './Web3';
import { UnsignedStack } from './UnsignedStack';

export class CoreTransactionManager implements TransactionManager {
  private _wallet: Wallet;
  private _unsignedStack: UnsignedStack;

  constructor(wallet: Wallet) {
    this._wallet = wallet;
    this._unsignedStack = new UnsignedStack();

    this.addClickEventListeners();
  }

 /**
  * Get the first account from the connected wallet
  * 
  */
  public getAccounts() {
    return [this._wallet.getAccounts()[0]];
  }

 /**
  * Entry method for signing/sending a transaction
  * 
  */
  public async signTransactionAsync(unsignedTx: UnsignedPayload) {
    // Populate the missing tx params
    unsignedTx.params = await this.populateMissingTxParams(unsignedTx);

    return new Promise((resolve, reject) => {
      this.addPayloadToStack(unsignedTx, resolve, reject);
    });
  }
  
 /**
  * Entry method for signing a message
  * 
  */
  public async signMessageAsync(unsignedMsg: UnsignedPayload) {
    return new Promise((resolve, reject) => {
      this.addPayloadToStack(unsignedMsg, resolve, reject);
    });
  }

 /**
  * Formats and adds an unsigned payload to the stack
  * 
  */
  private addPayloadToStack(payload: UnsignedPayload, resolve: any, reject: any) {
    const formattedPayload = {
      payload,
      resolve,
      reject 
    };
    this._unsignedStack.push(formattedPayload);
  }

 /**
  * Populates the missing tx params
  * 
  */
  private async populateMissingTxParams(unsignedPayload: UnsignedPayload): Promise<PartialTxParams> {
    const web3 = Web3.Instance;
    const defaultGasPrice = await promisify<BigNumber>(web3.eth.getGasPrice)();
    const gasLimit = await promisify<number>(web3.eth.estimateGas)(unsignedPayload.params);

    // TODO: This must be called every time a tx tops the stack to avoid reusing the previous nonce
    const nonce = await promisify<number>(web3.eth.getTransactionCount)(unsignedPayload.params.from, 'pending');

    const filledParams = <PartialTxParams>unsignedPayload.params;

    // Fill Params
    filledParams.gasPrice = `0x${defaultGasPrice.toString(16)}`;
    filledParams.gas = `0x${gasLimit.toString(16)}`;
    filledParams.nonce = `0x${nonce.toString(16)}`;

    return filledParams;
  }

 /**
  * Cancels a transaction
  * 
  */
  private cancelTx() {
    this._unsignedStack.peek().reject(SigningError.UserDeclined);
    this._unsignedStack.pop();
  }

 /**
  * Signs a transaction
  * 
  */
  private async signTxAsync() {
    const formattedPayload = this._unsignedStack.peek();

    // Sign the transaction
    const signedTx = await this._wallet.signer.signTransactionAsync(formattedPayload.payload.params as PartialTxParams);

    formattedPayload.resolve(signedTx);
    this._unsignedStack.pop();
  }

 /**
  * Cancels a message
  * 
  */
  private cancelMsg() {
    this._unsignedStack.peek().reject(SigningError.UserDeclined);
    this._unsignedStack.pop();
  }

 /**
  * Signs a message
  * 
  */
  private async signMsgAsync() {
    const formattedPayload = this._unsignedStack.peek();

    // Sign the message
    const signedMsg = await this._wallet.signer.signPersonalMessageAsync(formattedPayload.payload.params.from, formattedPayload.payload.params.data);

    formattedPayload.resolve(signedMsg);
    this._unsignedStack.pop();
  }

 /**
  * Adds the click event listeners
  * 
  */
  private addClickEventListeners() {
    const cancelTxButton = document.getElementById('cancelTxButton');
    const signTxButton = document.getElementById('signTxButton');
    const cancelMsgButton = document.getElementById('cancelMsgButton');
    const signMsgButton = document.getElementById('signMsgButton');

    cancelTxButton.addEventListener('click', this.cancelTx.bind(this));
    signTxButton.addEventListener('click', this.signTxAsync.bind(this));
    cancelMsgButton.addEventListener('click', this.cancelMsg.bind(this));
    signMsgButton.addEventListener('click', this.signMsgAsync.bind(this));    
  }
}
