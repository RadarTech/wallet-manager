import { CoreManager } from './managers/CoreManager';
import { CoreWallet } from './wallets/CoreWallet';

export class WalletManager {
  public core: CoreManager;

  constructor() {
    this.core = new CoreManager();
  }
}
