import { CoreTransactionManager } from "./TransactionManager";
import { UnsignedPayload, PayloadType, PartialTxParams } from "../src/types";
import { updateUI } from "./UIHelper";

export interface FormattedPayload {
  payload: UnsignedPayload;
  resolve: any;
  reject: any;
}

export class UnsignedStack {
  private _store: FormattedPayload[] = [];
  
  count(): number {
    return this._store.length;
  }

  isEmpty(): boolean {
    return !this._store.length;
  }

  push(val: FormattedPayload) {
    this._store.push(val);
    updateUI(val ? val.payload : undefined, this._store);
  }

  pop() {
    this._store.pop();
    updateUI(this.peek() ? this.peek().payload: undefined, this._store);
  }

  peek(): FormattedPayload | undefined {
    return this._store[this._store.length - 1];
  }
}