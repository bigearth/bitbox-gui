import BitcoinCash from './BitcoinCash'
import Bitcoin from 'bitcoinjs-lib';
import Block from '../models/Block';
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
  emptyMempool
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
  static setUpStore(dispatch) {
    console.log('called', dispatch)
    // Set up default redux store
    // configuration
    dispatch(createConfig());

    // import/export
    dispatch(createImportAndExport());

    // conversion
    dispatch(createConvert());

    // blockchain
    dispatch(createBlockchain());

    // mempool
    dispatch(createMempool());

    // sign/verify
    dispatch(createSignAndVerify());

    // expolorer
    dispatch(createExplorer());

    // exchange rate
    dispatch(setExchangeRate());

    // wallet
    dispatch(createWallet());

    // account send
    dispatch(createAccountSend());
  }

  static mineBlock(dispatch, blockchain) {
    dispatch(addBlock(blockchain));

    // flush mempool
    dispatch(emptyMempool());

    // update store
    dispatch(updateStore());
  }

  static createCoinbaseTx() {
    console.log('creating')
  }
}

export default Miner;
