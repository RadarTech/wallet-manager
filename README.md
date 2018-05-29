# vault-manager

A library that simplifies wallet & web3 creation.

## Usage

### Instantiation

#### Core Wallet Instantiation

```javascript
// Instantiate the WalletManager
const walletManager = new WalletManager();

// Create a new core wallet
const wallet = await walletManager.core.createWalletAsync({ password: 'supersecretpassword99' });
```

### Core Wallet Methods

### `CoreManager` Methods

#### `walletManager.core.createWalletAsync(options: CoreWalletOptions): Promise<CoreWallet>`

Create a new core wallet and save it into local storage.

#### Options

* **password** (mandatory) A string used to encrypt the vault when serialized.
* **seedPhrase** (optional) A twelve-word mnemonic used to generate all accounts. Randomly generated if not supplied.
* **salt** (optional) The salt used to encrypt & decrypt the vault. Randomly generated if not supplied.
* **hdPathString** (optional) A BIP39 compliant HD Path String. Defaults to `m/44'/60'/0'/0`.

#### `walletManager.core.saveWallet(wallet: CoreWallet): void`

Save the encrypted core wallet to local storage.

#### `walletManager.core.loadWalletAsync(password: string): Promise<CoreWallet>`
  
Load the core wallet from local storage.

### `CoreWallet` Methods

#### `coreWallet.addNewAccounts(numberOfAccounts: number = 1): void`

Adds 1 or more accounts to the core wallet instance and saves the updated wallet into local storage.

#### `coreWallet.exportAccountPrivateKeyAsync(account: string, password: string): Promise<string>`

Exports the private key for a single account.

#### `coreWallet.exportSeedPhraseAsync(password: string): Promise<string>`

Exports the wallet's seed phrase.

#### `coreWallet.getAccounts(): string[]`

Gets all the accounts from the wallet.

#### `coreWallet.serialize(): string`

Serialize the core wallet instance.

### `Signer` Methods

#### `coreWallet.signer.signPersonalMessageAsync(account: string, message: string): Promise<string>`
  
Sign a message.

#### `coreWallet.signer.signTransactionAsync(txParams: PartialTxParams): Promise<string>`
  
Sign a transaction.
