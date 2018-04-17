import * as mocha from 'mocha';
import * as chai from 'chai';
import { WalletManager } from '../../../src/WalletManager';
import { WalletError, PartialTxParams } from '../../../src/types';
import { CoreWallet } from '../../../src/wallets/CoreWallet';
import { CoreSigner } from '../../../src/signers/CoreSigner';

const expect = chai.expect;

/* tslint:disable:no-unused-expression */
describe('CoreSigner', () => {
    const seedPhrase = 'dilemma hollow outer pony cube season start stereo surprise when edit blast';
    const salt = 'kvODghzs7Ff1uqHyI0P3wI4Hso4w4iWT2e9qmrWz0y4';
    const password = 'supersecretpassword99';
    const address = '0x44be42fd88e22387c43ba9b75941aa3e680dae25';
    let signer: CoreSigner;

    before(async () => {
      const walletManager = new WalletManager();
      const options = {
        password: password,
        seedPhrase: seedPhrase,
        salt: salt,
        hdPathString: `m/44'/60'/0'`
      };
      signer = (await walletManager.core.createWalletAsync(options)).signer;
    });

    it('can sign a personal message', async () => {
      const message = 'hello world';

      // Sign the message
      const ecSignatureHex = await signer.signPersonalMessageAsync(address, message);

      expect(ecSignatureHex).to.be.equal(
        '0xa46b696c1aa8f91dbb33d1a66f6440bf3cf334c9dc45dc389668c1e60e2db31e259400b41f31632fa994837054c5345c88dc455c13931332489029adee6fd24d1b',
      );
    });

    it('can sign a transaction', async () => {
      const tx: PartialTxParams = {
        to: '0xafa3f8684e54059998bc3a7b0d2b0da075154d66',
        value: '0x00',
        gasPrice: '0x00',
        nonce: '0x00',
        gas: '0x00',
        from: address,
        chainId: 42
      };

      // Sign the transaction
      const signedTx = await signer.signTransactionAsync(tx);

      expect(signedTx.length).to.be.equal(192);
      expect(signedTx.substr(0, 2)).to.be.equal('0x');
    });
});
