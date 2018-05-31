# wallet-manager

A library that simplifies Ethereum wallet creation.

## Usage

### Instantiation

#### LightWallet Instantiation

```javascript
// Instantiate the WalletManager
const walletManager = new WalletManager();

// Create a new lightwallet
const wallet = await walletManager.createWalletAsync({ password: 'supersecretpassword99' });
```

### LightWallet Methods

### `LightWalletManager` Methods

#### `walletManager.createWalletAsync(options: LightWalletOptions): Promise<LightWallet>`

Create a new lightwallet and save it into local storage.

#### Options

* **password** (mandatory) A string used to encrypt the vault when serialized.
* **seedPhrase** (optional) A twelve-word mnemonic used to generate all accounts. Randomly generated if not supplied.
* **salt** (optional) The salt used to encrypt & decrypt the vault. Randomly generated if not supplied.
* **hdPathString** (optional) A BIP39 compliant HD Path String. Defaults to `m/44'/60'/0'/0`.

#### `walletManager.saveWallet(wallet: LightWallet): void`

Save the encrypted lightwallet to local storage.

#### `walletManager.loadWalletAsync(password: string): Promise<LightWallet>`
  
Load the lightwallet from local storage.

### `LightWallet` Methods

#### `lightWallet.addNewAccounts(numberOfAccounts: number = 1): void`

Adds 1 or more accounts to the lightwallet instance and saves the updated wallet into local storage.

#### `lightWallet.exportAccountPrivateKeyAsync(account: string, password: string): Promise<string>`

Exports the private key for a single account.

#### `lightWallet.exportSeedPhraseAsync(password: string): Promise<string>`

Exports the wallet's seed phrase.

#### `lightWallet.getAccounts(): string[]`

Gets all the accounts from the wallet.

#### `lightWallet.serialize(): string`

Serialize the lightwallet instance.

### `Signer` Methods

#### `lightWallet.signer.signPersonalMessageAsync(account: string, message: string): Promise<string>`
  
Sign a message.

#### `lightWallet.signer.signTransactionAsync(txParams: PartialTxParams): Promise<string>`
  
Sign a transaction.
