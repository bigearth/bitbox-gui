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
import BlocksContainer from './containers/BlocksContainer';
import BlockContainer from './containers/BlockContainer';
import SignAndVerifyContainer from './containers/SignAndVerifyContainer'
import ImportAndExportContainer from './containers/ImportAndExportContainer'
import ConvertContainer from './containers/ConvertContainer';
import StatusBarContainer from './containers/StatusBarContainer';

// custom components
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

import {
  createSignAndVerify
} from './actions/SignAndVerifyActions';

import underscore from 'underscore';

let reduxStore = createStore(bitboxReducer)

// const unsubscribe = reduxStore.subscribe(() =>{
//   console.log(JSON.stringify(reduxStore.getState(), null, 2))
//   console.log('*********************************************');
// })

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
    reduxStore.dispatch(createSignAndVerify());
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
    this.createBlock();
  }

  handlePathMatch(path) {
    if(path === '/' || path === '/blocks' || path === '/transactions' || path === '/configuration/wallet') {
      return true;
    } else {
      return false;
    }
  }

  createBlock() {
    let accounts = reduxStore.getState().wallet.accounts;
    let blockchain = reduxStore.getState().blockchain;
    let previousBlock = underscore.last(blockchain.chain) || {};
    let newIndex
    if(previousBlock.index || previousBlock.index === 0) {
      newIndex = previousBlock.index + 1;
    } else {
      newIndex = 0;
    }

    let walletConfig = reduxStore.getState().configuration.wallet;

    let alice = bitbox.BitcoinCash.fromWIF(accounts[0].privateKeyWIF)
    let txb = bitbox.BitcoinCash.transactionBuilder(walletConfig.network)
    txb.addInput('61d520ccb74288c96bc1a2b20ea1c0d5a704776dd0164a396efec3ea7040349d', 0) // Alice's previous transaction output, has 15000 satoshis
    txb.addOutput(accounts[0].legacy, 1250000000)
    // (in)15000 - (out)12000 = (fee)3000, this is the miner fee
    txb.sign(0, alice)
    let hex = txb.build().toHex();

    bitbox.RawTransactions.decodeRawTransaction(hex)
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
        inputs: inputs,
        outputs: outputs
      });

      let blockData = {
        index: newIndex,
        transactions: [tx],
        timestamp: Date()
      };

      let block = new Block(blockData)
      block.previousBlockHeader = previousBlock.header || "#BCHForEveryone";
      block.header = bitbox.Crypto.createSHA256Hash(`${block.index}${block.previousBlockHeader}${JSON.stringify(block.transactions)}${block.timestamp}`);
      blockchain.chain.push(block);
      let newChain = blockchain;
      reduxStore.dispatch(addBlock(newChain));
    }, (err) => { console.log(err);
    });
    // utxoSet.addUtxo(address, output.value);
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

    let chainlength = reduxStore.getState().blockchain.chain.length;

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
                    to="/blocks">
                    <i className="fas fa-cubes"></i> Blocks
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
            <StatusBarContainer />
            <ImportAndExportContainer />
            <Switch>
              <Route exact path="/blocks" component={BlocksContainer}/>
              <Route path="/blocks/:block_id" component={BlockContainer}/>
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
