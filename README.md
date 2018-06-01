# wallet-manager

A library that simplifies Ethereum wallet creation.

## Installation

### npm

```
npm install @radarrelay/wallet-manager
```

### Yarn

```
yarn add @radarrelay/wallet-manager
```

## LightWallet Usage

### Instantiation

```javascript
import { LightWalletManager } from '@radarrelay/wallet-manager';

// Instantiate the LightWalletManager
const walletManager = new LightWalletManager();
```

### LightWalletManager Methods

**Create a new wallet**

Create a new lightwallet and save it into local storage or as a file.

Options:

* **password** (mandatory) A string used to encrypt the vault when serialized.
* **seedPhrase** (optional) A twelve-word mnemonic used to generate all accounts. Randomly generated if not supplied.
* **salt** (optional) The salt used to encrypt & decrypt the vault. Randomly generated if not supplied.
* **hdPathString** (optional) A BIP39 compliant HD Path String. Defaults to `m/44'/60'/0'/0`.
* **storageKeyName** (optional) The local storage key or file name.

```javascript
const lightWallet = await walletManager.createWalletAsync(options: LightWalletOptions): Promise<LightWallet>
```

**Save an existing wallet**

Save the encrypted lightwallet into local storage or as a file.

```javascript
walletManager.saveWallet(wallet: LightWallet): void
```

**Load an existing wallet**

Load the lightwallet from local storage or the file system.

```javascript
const lightWallet = await walletManager.loadWalletAsync(password: string): Promise<LightWallet>
```


### LightWallet Methods

**Add new accounts**

Adds 1 or more accounts to the lightwallet instance and saves the updated wallet.

```javascript
lightWallet.addNewAccounts(numberOfAccounts: number = 1): void
```

**Export private key**

Exports the private key for a single account.

```javascript
const privateKey = lightWallet.exportAccountPrivateKeyAsync(account: string, password: string): Promise<string>
```

**Export seed phrase**

Exports the wallet's seed phrase.

```javascript
const seedPhrase = await lightWallet.exportSeedPhraseAsync(password: string): Promise<string>
```

**Get accounts**

Gets all the accounts from the wallet.

```javascript
const accounts = lightWallet.getAccounts(): string[]
```

**Serialize**

Serialize the encrypted lightwallet.

```javascript
const serializedWallet = lightWallet.serialize(): string
```

### Signer Methods

**Sign a message**

```javascript
const signedMsg = await lightWallet.signer.signPersonalMessageAsync(account: string, message: string): Promise<string>
```

**Sign a message hash**

```javascript
const signedMsgHash = await lightWallet.signer.signPersonalMessageHashAsync(account: string, messageHash: string): Promise<string>
```

**Sign a transaction**

```javascript
const signedTx = await lightWallet.signer.signTransactionAsync(txParams: PartialTxParams): Promise<string>
```
