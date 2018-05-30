import { CoreTransactionManager } from './TransactionManager';
import { UnsignedPayload, PayloadType, PartialTxParams } from '../src/types';
import { updateUI } from './UIHelper';

export interface FormattedPayload {
  payload: UnsignedPayload;
  resolve: any;
  reject: any;
}

export class UnsignedStack {
  private _store: FormattedPayload[] = [];

  public count(): number {
    return this._store.length;
  }

  public isEmpty(): boolean {
    return !this._store.length;
  }

  public push(val: FormattedPayload) {
    this._store.push(val);
    updateUI(val ? val.payload : undefined, this._store);
  }

  public pop() {
    this._store.pop();
    updateUI(this.peek() ? this.peek().payload : undefined, this._store);
  }

  public peek(): FormattedPayload | undefined {
    return this._store[this._store.length - 1];
  }
}
