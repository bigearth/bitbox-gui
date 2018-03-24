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

  static mineBlock() {
    let blockchain = reduxStore.getState().blockchain;

    let mempool = reduxStore.getState().mempool;

    let blockData = {
      index: blockchain.chain.length,
      transactions: [],
      timestamp: Date()
    };
    mempool.transactions.forEach((hex, index) => {
      bitbox.RawTransactions.decodeRawTransaction(hex)
      .then((result) => {
        result = JSON.parse(result);
        let inputs = [];
        result.vin.forEach((vin, index) => {
          inputs.push(new Input({
            scriptSig: vin.scriptSig,
            txid: vin.txid,
            vout: vin.vout,
            sequence: vin.sequence
          }));
        })

        let value = 0;
        let outputs = [];
        result.vout.forEach((vout, index) => {
          value += vout.value;
          outputs.push(new Output({
            scriptPubKey: vout.scriptPubKey,
            value: vout.value
          }));
        })

        let tx = new Transaction({
          size: result.size,
          vsize: result.vsize,
          value: value,
          rawHex: hex,
          timestamp: Date(),
          txid: result.txid,
          inputs: inputs,
          outputs: outputs
        });

        blockData.transactions.push(tx);

        if((index + 1) === mempool.transactions.length) {
          let block = new Block(blockData)
          let previousBlock = underscore.last(blockchain.chain) || {};
          block.previousBlockHeader = previousBlock.header || "#BCHForEveryone";
          block.header = bitbox.Crypto.createSHA256Hash(`${block.index}${block.previousBlockHeader}${JSON.stringify(block.transactions)}${block.timestamp}`);

          blockchain.chain.push(block);
          //
          // Miner.mineBlock(blockchain)

          reduxStore.dispatch(addBlock(blockchain));

          // flush mempool
          reduxStore.dispatch(emptyMempool());

          // update store
          reduxStore.dispatch(updateStore());
        }
      }, (err) => { console.log(err);
      });
    })
  }

  static createCoinbaseTx() {
    let blockchain = reduxStore.getState().blockchain;
    let account1 = reduxStore.getState().wallet.accounts[0];
    let account2 = reduxStore.getState().wallet.accounts[1];

    // create transaction
    let txb = bitbox.BitcoinCash.transactionBuilder(reduxStore.getState().configuration.wallet.network);

    // add input hash w/ index
    txb.addInput('d77430e734b94e8e3754830e69675bf2e6a559c8fa8086eaeade0b412d4a36af', 0);

    let value = 1250000000;
    let addy = account1.addresses.getChainAddress(0);
    txb.addOutput(addy, value);

    let alice = bitbox.HDNode.fromWIF(account1.privateKeyWIF);
    txb.sign(0, alice);

    let hex = txb.build().toHex();
    // add tx to mempool
    reduxStore.dispatch(addTx(hex));

    // bump address counter to next address
    account1.addresses.nextChainAddress(0);
  }
}

export default Miner;
