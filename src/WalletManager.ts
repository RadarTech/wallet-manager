export class WalletManager<T> {
  public manager: T;

  constructor(Manager: new () => T) {
    this.manager = new Manager();
  }
}
