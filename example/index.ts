import { WalletManager } from "../src/WalletManager";
import { Web3Builder } from '../src/Web3Builder';
import { CoreTransactionManager } from "./TransactionManager";
import { InfuraNetwork } from "../src/types";
import { CoreWallet } from "../src/Wallets/CoreWallet";
import { promisify } from "@0xproject/utils";
import { Web3 } from "./Web3";

const w = (window as any);
const activeAddressSpan = document.getElementById('activeAddress');
const web3InitializedSpan = document.getElementById('web3Initialized');
const transactionHistorySpan = document.getElementById('txHistory');
const initWeb3Button = <HTMLButtonElement>document.getElementById('initWeb3');
const callWeb3SignButton = <HTMLButtonElement>document.getElementById('callWeb3Sign');
const callWeb3SendTransactionButton = <HTMLButtonElement>document.getElementById('callWeb3SendTransaction');

let wallet: CoreWallet;
let history: Array<any> = []; 

/**
 * Creates a new core wallet instance
 * 
 */
w.createNewCoreWalletAsync = async function()  {
  // Instantiate the WalletManager
  const walletManager = new WalletManager();

  // Create a new core wallet
  wallet = await walletManager.core.createWalletAsync({ password: 'supersecretpassword99' });
  
  // Display active address
  activeAddressSpan.innerHTML = wallet.getAddresses()[0];

  // Enable Web3 Button
  initWeb3Button.disabled = false;
}

/**
 * Initializes web3 against Kovan
 * 
 */
w.initializeWeb3 = function() {
  // Instantiate the Web3Builder
  const web3Builder = new Web3Builder();

  // Instantiate the TransactionManager. Pass the core wallet instance into the constructor.
  const transactionManager = new CoreTransactionManager(wallet.signer);

  // Create the web3 object
  Web3.Instance = web3Builder.setSignerAndRpcConnection(transactionManager, InfuraNetwork.Kovan);

  // Set Web3 Initialized text
  web3InitializedSpan.innerHTML = 'Yes';
  callWeb3SendTransactionButton.disabled = false;
  callWeb3SignButton.disabled = false;
}

/**
 * Calls web3.eth.sign with an arbitrary message
 * 
 */
w.callWeb3Sign = async function() {
  try {
    const web3 = Web3.Instance;
    const signedMsg = await promisify(web3.eth.sign)(wallet.getAddresses()[0], 'hello world');
    history.push(signedMsg);
  } catch (err) {
    history.push(err);
  } 
  transactionHistorySpan.innerHTML = JSON.stringify(history);
}

/**
 * Calls web3.eth.sendTransaction with arbitrary tx params
 * 
 */
w.callWeb3SendTransaction = async function() {
  try {
    const web3 = Web3.Instance;
    const signedTx = await promisify(web3.eth.sendTransaction)({
      from: wallet.getAddresses()[0],
      to: '0x000000000000000000000000000000000000dEaD',
      value: '1000000000000000', // 0.001 ETH
    });
    history.push(signedTx);
  } catch (err) {
    history.push(err);
  }
  transactionHistorySpan.innerHTML = JSON.stringify(history);
}
