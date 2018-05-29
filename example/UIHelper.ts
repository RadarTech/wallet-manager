import { UnsignedPayload, PayloadType, PartialTxParams } from '../src/types';
import { FormattedPayload } from './UnsignedStack';

/**
 * Updates the UI for demo purposes
 *
 */
export function updateUI(unsignedPayload: UnsignedPayload, store: FormattedPayload[]) {
  const txStack = document.getElementById('txStack');
  const from = document.getElementById('from');
  const to = document.getElementById('to');
  const message = document.getElementById('message');
  const txDiv = document.getElementById('txDiv');
  const msgDiv = document.getElementById('msgDiv');
  const gasPrice = document.getElementById('gasPrice') as HTMLInputElement;
  const gasLimit = document.getElementById('gasLimit') as HTMLInputElement;

  if (!unsignedPayload) {
    // Clear Stack
    txStack.innerHTML = JSON.stringify(store);
    from.innerHTML = '';
    to.innerHTML = '';
    gasPrice.value = '';
    gasLimit.value = '';
    message.innerHTML = '';
    return;
  }

  // Display Stack in UI
  txStack.innerHTML = JSON.stringify(store);
  if (unsignedPayload.type === PayloadType.Tx) {
    const params = unsignedPayload.params as PartialTxParams;
    from.innerHTML = params.from;
    to.innerHTML = params.to;
    gasPrice.value = params.gasPrice;
    gasLimit.value = params.gas;
    txDiv.style.display = 'block';
    msgDiv.style.display = 'none';
  } else {
    message.innerHTML = unsignedPayload.params.data;
    msgDiv.style.display = 'block';
    txDiv.style.display = 'none';
  }
}
