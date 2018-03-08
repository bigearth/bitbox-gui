// react imports
import React, { Component } from 'react';
import {
  BrowserRouter as Router,
  Route,
  Link,
  Switch,
  Redirect,
  NavLink
} from 'react-router-dom';
import Bitcoin from 'bitcoinjs-lib';

// custom models
import Block from './models/Block';
import Transaction from './models/Transaction';
import Output from './models/Output';
import Input from './models/Input';
import Utxo from './models/Utxo';

import WalletContainer from './containers/WalletContainer'
import SignAndVerifyContainer from './containers/SignAndVerifyContainer'
import ImportAndExportContainer from './containers/ImportAndExportContainer'
import ConvertContainer from './containers/ConvertContainer';

// custom components
import Blocks from './components/Blocks';
import BlockDetails from './components/BlockDetails';
// import Account from './components/Account';
import TransactionsDisplay from './components/TransactionsDisplay';
import Configuration from './components/Configuration';

// utilities
import BitcoinCash from './utilities/BitcoinCash';
import Miner from './utilities/Miner';

// css
import './styles/app.scss';

import { Provider } from 'react-redux'
import { createStore } from 'redux'
import bitboxReducer from './reducers/bitbox'

// redux actions
import {
  createConfig,
  toggleWalletConfig,
  updateWalletConfig,
  updateStore
} from './actions/ConfigurationActions';

import {
  createWallet,
  addRootSeed,
  addMasterPrivateKey,
  createAccount
} from './actions/WalletActions';

import {
  createImportAndExport,
  toggleVisibility,
  toggleExportCopied
} from './actions/ImportAndExportActions';

import {
  createConvert
} from './actions/ConvertActions';

import {
  createBlockchain,
  addBlock
} from './actions/BlockchainActions';

import underscore from 'underscore';

let reduxStore = createStore(bitboxReducer)

const unsubscribe = reduxStore.subscribe(() =>{
  console.log(JSON.stringify(reduxStore.getState(), null, 2))
  console.log('*********************************************');
})

// stop listening to state updates
// unsubscribe()

class App extends Component {

  constructor(props) {
    super(props);
    // Write default config top reduxStore
    reduxStore.dispatch(createConfig());
    reduxStore.dispatch(createImportAndExport());
    reduxStore.dispatch(createConvert());
    reduxStore.dispatch(createBlockchain());
    let genesisBlock = new Block({
      index: 0,
      transactions: [{coinAmount : 10}],
      timestamp: Date()
    });
    genesisBlock.previousBlockHeader = "#BCHForEveryone";
    genesisBlock.header = bitbox.Crypto.createSHA256Hash(`${genesisBlock.index}${genesisBlock.previousBlockHeader}${JSON.stringify(genesisBlock.transactions)}${genesisBlock.timestamp}`);

    reduxStore.dispatch(addBlock(genesisBlock));
  }

  componentDidMount() {
    this.createHDWallet();
  }


  createHDWallet() {
    let walletConfig = reduxStore.getState().configuration.wallet;
    let [rootSeed, masterPrivateKey, mnemonic, HDPath, accounts] = bitbox.BitcoinCash.createHDWallet(walletConfig);
    reduxStore.dispatch(createWallet());
    reduxStore.dispatch(addRootSeed(rootSeed));
    reduxStore.dispatch(addMasterPrivateKey(masterPrivateKey.chainCode));
    reduxStore.dispatch(updateWalletConfig('mnemonic', mnemonic));
    reduxStore.dispatch(updateWalletConfig('HDPath', HDPath));

    accounts.forEach((account, index) => {

      let address = bitbox.BitcoinCash.fromWIF(account.privateKeyWIF, walletConfig.network).getAddress();
      let formattedAccount = {
        title: account.title,
        index: account.index,
        privateKeyWIF: account.privateKeyWIF,
        xpriv: account.xpriv,
        xpub: account.xpub,
        legacy: address,
        cashAddr: bitbox.BitcoinCash.toCashAddress(address)
      };

      reduxStore.dispatch(createAccount(formattedAccount));
    });
    reduxStore.dispatch(updateStore());
  }

  handlePathMatch(path) {
    if(path === '/' || path === '/blocks' || path === '/transactions' || path === '/configuration/wallet') {
      return true;
    } else {
      return false;
    }
  }

  handleUtxoUpdate(utxoSet) {
    this.setState({
      utxoSet: utxoSet
    })
  }

  createBlock() {
    let blockchain = reduxStore.getState().blockchain;
    let previousBlock = underscore.last(blockchain.chain);
    let lastIndex = previousBlock.index;

    let blockData = {
      index: ++lastIndex,
      transactions: [{coinAmount : ++lastIndex}],
      timestamp: Date()
    };

    let block = new Block(blockData)
    block.previousBlockHeader = previousBlock.header;
    block.header = bitbox.Crypto.createSHA256Hash(`${block.index}${block.previousBlockHeader}${JSON.stringify(block.transactions)}${block.timestamp}`);
    reduxStore.dispatch(addBlock(block));
    //
    // let block2Data = {
    //   index: 2,
    //   transactions: {coinAmount : 2},
    //   timestamp: Date()
    // };
    //
    // let block2 = new Block(block2Data)
    // blockchain.addBlock(block2);
    //
    // let block3Data = {
    //   index: 3,
    //   transactions: {coinAmount : 3},
    //   timestamp: Date()
    // };
    //
    // let block3 = new Block(block3Data)
    // blockchain.addBlock(block3);

    // let blockchainInstance = this.state.blockchainInstance;
    //
    // let keyPair = bitbox.BitcoinCash.fromWIF(this.state.addresses[0].privateKeyWIF, this.wallet.network);
    // let address = keyPair.getAddress();
    // let ripemd160 = bitbox.Crypto.createRIPEMD160Hash(address);
    //
    // let output = new Output({
    //   value: 5000000000,
    //   ripemd160: ripemd160
    // });
    //
    // let tx = new Transaction({
    //   versionNumber: 1,
    //   inputs: [],
    //   outputs: [output],
    //   time: Date.now(),
    //   address: address
    // }, true);
    //
    // let block = {
    //   hash: '0x000000000019d6689c085ae165831e934ff763ae46a2a6c172b3f1b60a8ce26f',
    //   version: 1,
    //   hashPrevBlock: '00000000000000',
    //   hashMerkleRoot: '0x4a5e1e4baab89f3a32518a88c31bc87f618f76673e2cc77ab2127b7afdeda33b',
    //   time: Date.now(),
    //   bits: '0x1d00ffff',
    //   nonce: '2083236893',
    //   vtx: 1,
    //   index: blockchainInstance.chain.length,
    //   transactions: [tx],
    //   previousHash: blockchainInstance.getLatestBlock().blockheader.hashMerkleRoot
    // };
    //
    // blockchainInstance.addBlock(new Block(block));
    // let utxoSet = this.state.utxoSet;
    // utxoSet.addUtxo(address, output.value);
    // this.handleBlockchainUpdate(blockchainInstance);
    // this.handleUtxoUpdate(utxoSet);
  }

  showImport() {
    reduxStore.dispatch(toggleVisibility('import'));
  }

  showExport() {
    reduxStore.dispatch(toggleVisibility('export'));
  }

  render() {

    const pathMatch = (match, location) => {
      if (!match) {
        return false
      }
      return this.handlePathMatch(match.path);
    }

    const BlocksPage = (props) => {
      return (
        <Blocks
          match={props.match}
        />
      );
    };

    const BlockPage = (props) => {
      return (
        <BlockDetails
          match={props.match}
        />
      );
    };

    const AddressPage = (props) => {
      return (
        <Account
          match={props.match}
        />
      );
    };

    const TransactionsPage = (props) => {
      return (
        <TransactionsDisplay
          match={props.match}
        />
      );
    };

    const ConfigurationPage = (props) => {
      return (
        <Configuration
          match={props.match}
        />
      );
    };

    let chainlength = reduxStore.getState().blockchain.length;
                // <li className="pure-menu-item">
                //   <NavLink
                //     isActive={pathMatch}
                //     activeClassName="pure-menu-selected"
                //     className="pure-menu-link"
                //     to="/blocks">
                //     <i className="fas fa-cubes"></i> Blocks
                //   </NavLink>
                // </li>

    return (
      <Provider store={reduxStore}>
        <Router>
          <div className="header main-header">
            <div className="pure-menu pure-menu-horizontal">
              <Link className="pure-menu-heading" to="/">BitBox</Link>
              <ul className="pure-menu-list">

                <li className="pure-menu-item">
                  <NavLink
                    isActive={pathMatch}
                    activeClassName="pure-menu-selected"
                    className="pure-menu-link"
                    to="/">
                    <i className="fas fa-user"></i> Wallet
                  </NavLink>
                </li>
                <li className="pure-menu-item">
                  <NavLink
                    isActive={pathMatch}
                    activeClassName="pure-menu-selected"
                    className="pure-menu-link"
                    to="/convert">
                    <i className="fas fa-qrcode" /> Convert
                  </NavLink>
                </li>
                <li className="pure-menu-item">
                  <NavLink
                    isActive={pathMatch}
                    activeClassName="pure-menu-selected"
                    className="pure-menu-link"
                    to="/signandverify">
                    <i className="far fa-check-circle"></i> Sign &amp; Verify
                  </NavLink>
                </li>
                <li className="pure-menu-item">
                  <button className='pure-button danger-background' onClick={this.createBlock.bind(this)}><i className="fas fa-cube"></i> Create block</button>
                </li>
              </ul>
              <ul className="pure-menu-list right">
                <li className="pure-menu-item">
                  <button className="importAndExportBtn" onClick={this.showExport.bind(this)}>
                    <i className="fas fa-upload" />
                  </button>
                </li>
                <li className="pure-menu-item">
                  <button className="importAndExportBtn" onClick={this.showImport.bind(this)}>
                    <i className="fas fa-download" />
                  </button>
                </li>
                <li className="pure-menu-item">
                  <NavLink
                    isActive={pathMatch}
                    activeClassName="pure-menu-selected"
                    className="pure-menu-link"
                    to="/configuration/wallet">
                    <i className="fas fa-cog" />
                  </NavLink>
                </li>
              </ul>
            </div>
            <div className="pure-menu pure-menu-horizontal networkInfo">
              <ul className="pure-menu-list">
                <li className="pure-menu-item">
                  CURRENT BLOCK <br />
                  {chainlength}
                </li>
                <li className="pure-menu-item">
                  RPC SERVER <br /> http://127.0.0.1:8332
                </li>
                <li className="pure-menu-item">
                  MINING STATUS <br /> AUTOMINING <i className="fas fa-spinner fa-spin" />
                </li>
              </ul>
            </div>
            <ImportAndExportContainer />
            <Switch>
              <Route exact path="/blocks" component={BlocksPage}/>
              <Route path="/blocks/:block_id" component={BlockPage}/>
              <Route path="/transactions/:transaction_id" component={TransactionsPage}/>
              <Route path="/convert" component={ConvertContainer}/>
              <Route path="/signandverify" component={SignAndVerifyContainer}/>
              <Route path="/configuration" component={ConfigurationPage}/>
              <Route exact path="/" component={WalletContainer}/>
              <Redirect from='*' to='/' />
            </Switch>
          </div>
        </Router>
      </Provider>
    );
  }
}

export default App;
