import BitcoinCash from './BitcoinCash'
import Bitcoin from 'bitcoinjs-lib';
import Block from '../models/Block';
import underscore from 'underscore';
import reduxStore from './ReduxStore'

import {
  createConfig,
  updateStore,
  setExchangeRate
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
  createWallet
} from '../actions/WalletActions';

import {
  createAccountSend
} from '../actions/AccountSendActions';


class Miner {
  static setUpStore() {
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

  static mineBlock(blockchain) {
    reduxStore.dispatch(addBlock(blockchain));

    // flush mempool
    reduxStore.dispatch(emptyMempool());

    // update store
    reduxStore.dispatch(updateStore());
  }

  static createCoinbaseTx() {
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
    return hex;
  }
}

export default Miner;
