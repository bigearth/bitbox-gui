import BitcoinCash from './BitcoinCash'
import underscore from 'underscore';
import reduxStore from './ReduxStore'
import Block from '../models/Block';
import Transaction from '../models/Transaction';
import Output from '../models/Output';
import Input from '../models/Input';

import {
  createConfig,
  updateStore,
  setExchangeRate,
  updateWalletConfig
} from '../actions/ConfigurationActions';

import {
  createImportAndExport
} from '../actions/ImportAndExportActions';

import {
  createConvert
} from '../actions/ConvertActions';

import {
  createBlockchain,
  addBlock
} from '../actions/BlockchainActions';

import {
  createSignAndVerify
} from '../actions/SignAndVerifyActions';

import {
  createMempool,
  emptyMempool,
  addTx
} from '../actions/MempoolActions';

import {
  createExplorer
} from '../actions/ExplorerActions';

import {
  createWallet,
  createAccount,
  updateAccount
} from '../actions/WalletActions';

import {
  createAccountSend
} from '../actions/AccountSendActions';

class Miner {
  static setUpReduxStore() {
    // Set up default redux store
    // configuration
    reduxStore.dispatch(createConfig());

    // import/export
    reduxStore.dispatch(createImportAndExport());

    // conversion
    reduxStore.dispatch(createConvert());

    // blockchain
    reduxStore.dispatch(createBlockchain());

    // mempool
    reduxStore.dispatch(createMempool());

    // sign/verify
    reduxStore.dispatch(createSignAndVerify());

    // expolorer
    reduxStore.dispatch(createExplorer());

    // exchange rate
    reduxStore.dispatch(setExchangeRate());

    // wallet
    reduxStore.dispatch(createWallet());

    // account send
    reduxStore.dispatch(createAccountSend());
  }

  static createAccounts() {
    let walletConfig = reduxStore.getState().configuration.wallet;

    if(walletConfig.autogenerateHDMnemonic) {
      // create a random mnemonic w/ user provided entropy size
      let randomBytes = bitbox.Crypto.randomBytes(walletConfig.entropy);
      walletConfig.mnemonic = bitbox.Mnemonic.entropyToMnemonic(randomBytes, bitbox.Mnemonic.mnemonicWordLists()[walletConfig.language]);
    }
    let accounts = BitcoinCash.createAccounts(walletConfig);
    reduxStore.dispatch(updateWalletConfig('mnemonic', walletConfig.mnemonic));
    reduxStore.dispatch(updateWalletConfig('HDPath', walletConfig.HDPath));

    accounts.forEach((account, index) => {
      let xpriv = bitbox.HDNode.toXPriv(account);
      let xpub = bitbox.HDNode.toXPub(account);

      let formattedAccount = {
        addresses: account.addresses,
        title: '',
        index: index,
        privateKeyWIF:  bitbox.HDNode.toWIF(account),
        xpriv: xpriv,
        xpub: xpub
      };
      reduxStore.dispatch(createAccount(formattedAccount));
    });
  }

  static mineBlock(blockchain) {
    reduxStore.dispatch(addBlock(blockchain));

    // flush mempool
    reduxStore.dispatch(emptyMempool());

    // update store
    reduxStore.dispatch(updateStore());
  }

  static createCoinbaseTx() {
    let blockchain = reduxStore.getState().blockchain;
    let account1 = reduxStore.getState().wallet.accounts[0];
    let account2 = reduxStore.getState().wallet.accounts[1];
    let alice = bitbox.HDNode.fromWIF(account1.privateKeyWIF);
    let txb = bitbox.BitcoinCash.transactionBuilder(reduxStore.getState().configuration.wallet.network);
    txb.addInput('61d520ccb74288c96bc1a2b20ea1c0d5a704776dd0164a396efec3ea7040349d', 0);
    let value = 1250000000;
    let addy = account1.addresses.getChainAddress(0);
    txb.addOutput(addy, value);
    txb.sign(0, alice);
    let hex = txb.build().toHex();
    // add tx to mempool
    reduxStore.dispatch(addTx(hex));

    // bump address counter to next address
    account1.addresses.nextChainAddress(0);

    let mempool = reduxStore.getState().mempool;
    bitbox.RawTransactions.decodeRawTransaction(mempool.transactions[0])
    .then((result) => {
      let inputs = [];
      result.ins.forEach((vin, index) => {
        inputs.push(new Input({
          hex: vin.hex,
          inputPubKey: vin.inputPubKey,
          script: vin.script
        }));
      })

      let outputs = [];
      result.outs.forEach((vout, index) => {
        outputs.push(new Output({
          hex: vout.hex,
          outputPubKey: vout.outputPubKey,
          script: vout.script
        }));
      })

      let tx = new Transaction({
        value: 1250000000,
        rawHex: hex,
        timestamp: Date(),
        hash: bitbox.Crypto.createSHA256Hash(hex),
        inputs: inputs,
        outputs: outputs
      });

      let blockData = {
        index: 0,
        transactions: [tx],
        timestamp: Date()
      };

      let block = new Block(blockData)
      let previousBlock = underscore.last(blockchain.chain) || {};
      block.previousBlockHeader = previousBlock.header || "#BCHForEveryone";
      block.header = bitbox.Crypto.createSHA256Hash(`${block.index}${block.previousBlockHeader}${JSON.stringify(block.transactions)}${block.timestamp}`);

      reduxStore.dispatch(updateAccount(account1));
      blockchain.chain.push(block);

      Miner.mineBlock(blockchain)
    }, (err) => { console.log(err);
    });
  }
}

export default Miner;
