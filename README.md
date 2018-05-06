# vault-manager

A library that simplifies wallet & web3 creation.

## Usage

### Wallet Creation

```javascript
// Instantiate the WalletManager
const walletManager = new WalletManager();

// Create a new core wallet
const wallet = await walletManager.core.createWalletAsync({ password: 'supersecretpassword99' });
```

### Web3 Creation

```javascript
// Instantiate the Web3Builder
const web3Builder = new Web3Builder();

// Instantiate the TransactionManager. Pass the core wallet instance into the constructor.
const transactionManager = new CoreTransactionManager(wallet);

// Create the web3 object
const web3 = web3Builder.setSignerAndRpcConnection(transactionManager, InfuraNetwork.Kovan);
```
