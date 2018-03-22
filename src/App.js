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

// custom models
import Block from './models/Block';
import Transaction from './models/Transaction';
import Output from './models/Output';
import Input from './models/Input';
import underscore from 'underscore';

import WalletContainer from './containers/WalletContainer'
import BlocksContainer from './containers/BlocksContainer';
import BlockContainer from './containers/BlockContainer';
import AddressContainer from './containers/AddressContainer';
import AccountDetailsContainer from './containers/AccountDetailsContainer';
import TransactionContainer from './containers/TransactionContainer';
import SignAndVerifyContainer from './containers/SignAndVerifyContainer'
import ImportAndExportContainer from './containers/ImportAndExportContainer'
import ConvertContainer from './containers/ConvertContainer';
import StatusBarContainer from './containers/StatusBarContainer';
import ExplorerContainer from './containers/ExplorerContainer'

// custom components
import Configuration from './components/Configuration';

// utilities
import BitcoinCash from './utilities/BitcoinCash';

// css
import './styles/app.scss';

import { Provider } from 'react-redux'
import { createStore } from 'redux'
import bitboxReducer from './reducers/bitbox'

// redux actions
import {
  createConfig,
  updateWalletConfig,
  updateStore,
  setExchangeRate
} from './actions/ConfigurationActions';

import {
  createWallet,
  createAccount,
  updateAccount
} from './actions/WalletActions';

import {
  createImportAndExport,
  toggleVisibility
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

import {
  createExplorer
} from './actions/ExplorerActions';

import {
  createAccountSend
} from './actions/AccountSendActions';

import {
  createMempool,
  emptyMempool,
  addTx
} from './actions/MempoolActions';

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

    // Set up default redux store
    reduxStore.dispatch(createConfig());
    reduxStore.dispatch(createImportAndExport());
    reduxStore.dispatch(createConvert());
    reduxStore.dispatch(createBlockchain());
    reduxStore.dispatch(createMempool());
    reduxStore.dispatch(createSignAndVerify());
    reduxStore.dispatch(createExplorer());
    reduxStore.dispatch(setExchangeRate());
  }

  componentDidMount() {
    this.createAccounts();
  }


  createAccounts() {
    let walletConfig = reduxStore.getState().configuration.wallet;

    if(walletConfig.autogenerateHDMnemonic) {
      // create a random mnemonic w/ user provided entropy size
      let randomBytes = bitbox.Crypto.randomBytes(walletConfig.entropy);
      walletConfig.mnemonic = bitbox.Mnemonic.entropyToMnemonic(randomBytes, bitbox.Mnemonic.mnemonicWordLists()[walletConfig.language]);
    }
    let accounts = BitcoinCash.createAccounts(walletConfig);
    reduxStore.dispatch(createWallet());
    reduxStore.dispatch(updateWalletConfig('mnemonic', walletConfig.mnemonic));
    reduxStore.dispatch(updateWalletConfig('HDPath', walletConfig.HDPath));
    reduxStore.dispatch(createAccountSend());

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

    let blockchain = reduxStore.getState().blockchain;
    let previousBlock = underscore.last(blockchain.chain) || {};
    let account1 = reduxStore.getState().wallet.accounts[0];
    let account2 = reduxStore.getState().wallet.accounts[1];

    let alice = bitbox.HDNode.fromWIF(account1.privateKeyWIF);
    let txb = bitbox.BitcoinCash.transactionBuilder(walletConfig.network);
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
        value: value,
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
      block.previousBlockHeader = previousBlock.header || "#BCHForEveryone";
      block.header = bitbox.Crypto.createSHA256Hash(`${block.index}${block.previousBlockHeader}${JSON.stringify(block.transactions)}${block.timestamp}`);

      reduxStore.dispatch(updateAccount(account1));
      blockchain.chain.push(block);

      let newChain = blockchain;
      reduxStore.dispatch(addBlock(newChain));

      // flush mempool
      reduxStore.dispatch(emptyMempool());

      // update store
      reduxStore.dispatch(updateStore());

    }, (err) => { console.log(err);
    });
  }

  handlePathMatch(path) {
    if(path === '/wallet' || path === '/blocks' || path === '/transactions' || path === '/convert' || path === '/signandverify' || path === '/configuration/wallet') {
      return true;
    } else {
      return false;
    }
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
              <Link className="pure-menu-heading" to="/wallet">BitBox</Link>
              <ul className="pure-menu-list">

                <li className="pure-menu-item">
                  <NavLink
                    isActive={pathMatch}
                    activeClassName="pure-menu-selected"
                    className="pure-menu-link"
                    to="/wallet">
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
              </ul>
              <ul className="pure-menu-list right">
                <li className="pure-menu-item Explorer">
                  <ExplorerContainer />
                </li>
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
              <Route path="/blocks/:block_id/transactions/:transaction_id" component={TransactionContainer}/>
              <Route path="/blocks/:block_id" component={BlockContainer}/>
              <Route path="/accounts/:account_id" component={AccountDetailsContainer}/>
              <Route path="/addresses/:address_id" component={AddressContainer}/>
              <Route path="/convert" component={ConvertContainer}/>
              <Route path="/signandverify" component={SignAndVerifyContainer}/>
              <Route path="/configuration" component={ConfigurationPage}/>
              <Route path="/wallet" component={WalletContainer}/>
              <Redirect from='*' to='/wallet' />
            </Switch>
          </div>
        </Router>
      </Provider>
    );
  }
}

export default App;
