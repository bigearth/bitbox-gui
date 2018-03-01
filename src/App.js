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
import Blockchain from './models/Blockchain';
import Block from './models/Block';
import Transaction from './models/Transaction';
import Output from './models/Output';
import Input from './models/Input';
import Utxo from './models/Utxo';
import Wallet from './models/Wallet';

// custom components
import WalletDisplay from './components/WalletDisplay';
import Blocks from './components/Blocks';
import BlockDetails from './components/BlockDetails';
// import AddressDisplay from './components/AddressDisplay';
import TransactionsDisplay from './components/TransactionsDisplay';
import ConvertDisplay from './components/ConvertDisplay';
import MessageDisplay from './components/MessageDisplay';
import ConfigurationDisplay from './components/ConfigurationDisplay';

// utilities
import Crypto from './utilities/Crypto';
import BitcoinCash from './utilities/BitcoinCash';
import Miner from './utilities/Miner';

// css
import './styles/app.scss';

import { Provider } from 'react-redux'
import { createStore } from 'redux'
import bitbox from './reducers/bitbox'

import {
  createConfig,
  toggleWalletConfig,
  updateWalletConfig
} from './actions/ConfigurationActions';

import {
  createWallet,
  addRootSeed,
  addMasterPrivateKey,
  createAccount,
  toggleDisplayAccount
} from './actions/WalletActions';

let reduxStore = createStore(bitbox)

const unsubscribe = reduxStore.subscribe(() =>{
  console.log(JSON.stringify(reduxStore.getState(), null, 2))
  console.log('**');
})

// dispatch some actions
let mnemonic = 'business antique staff gap chief harbor federal answer bright icon badge polar';
reduxStore.dispatch(createConfig())
// reduxStore.dispatch(toggleWalletConfig(false, 'autogenerateHDMnemonic'))
// reduxStore.dispatch(toggleWalletConfig(false, 'autogenerateHDPath'))
// reduxStore.dispatch(toggleWalletConfig(false, 'displayCashaddr'))
// reduxStore.dispatch(toggleWalletConfig(false, 'displayTestnet'))
// reduxStore.dispatch(toggleWalletConfig(false, 'usePassword'))
//
// reduxStore.dispatch(updateWalletConfig(32, 'entropy'))
// reduxStore.dispatch(updateWalletConfig('test', 'network'))
// reduxStore.dispatch(updateWalletConfig(mnemonic, 'mnemonic'))
// reduxStore.dispatch(updateWalletConfig(25, 'totalAccounts'))
// reduxStore.dispatch(updateWalletConfig("m/1'/2'/3'", 'HDPath'))
// reduxStore.dispatch(updateWalletConfig('l337', 'password'))

// stop listening to state updates
// unsubscribe()


class App extends Component {

  constructor(props) {
    super(props);

    // Create HD wallet w/ default configuration
    reduxStore.dispatch(createWallet())
    reduxStore.dispatch(addRootSeed('root seed'))
    reduxStore.dispatch(addMasterPrivateKey('master private key'))
    reduxStore.dispatch(createAccount({
      title: '',
      index: 1,
      privatekeywif: 'cuapfdjmeuy1y8brprntvkzcvyten5bmiq4zjotjkatlhle1pomg',
      xpriv: 'tprv8fr6gny9ysnhpjpoaur7jnuwfmgynvckqqgokgpkdv1phpnsa2pt7zuwihztmwbfmh5jqqmqrjywlkfclo5hjewfrr3vxfignzdaktn4nch',
      xpub: 'tpubdcy8rd1pgptxgmrbu8wi8na4ennuyfoeyihabns44bonxt3ecre3jv6otqujdgax6mtlburtnlh45gwotjyuwwq69j4nvqqjwts9syhgqai'
    }))
    reduxStore.dispatch(toggleDisplayAccount(1))
    reduxStore.dispatch(toggleDisplayAccount(1))
    this.wallet = new Wallet({
      entropy: 16,
      network: 'bitcoin',
      mnemonic: '',
      totalAccounts: 10,
      autogenerateMnemonic: true,
      autogeneratePath: true,
      path: '',
      displayCashaddr: true,
      password: '',
      usePassword: false,
      displayTestnet: false
    });
    store.set('wallet', this.wallet);

    this.blockchain = new Blockchain();

    this.utxoSet = new Utxo();
    // Miner Utility for handling txs and blocks

    this.state = {
      mnemonic: this.wallet.mnemonic,
      addresses: [],
      blockchainInstance: this.blockchain,
      utxoSet: this.utxoSet,
      password: '',
      showCreateBtn: false
    };
    this.miner = new Miner(this.blockchain, this.utxoSet, this.wallet.network);
  }

  componentDidMount() {
    let [mnemonic, path, addresses] = BitcoinCash.createHDWallet(this.wallet);
    store.set('addresses', addresses);

    this.setState({
      mnemonic: mnemonic,
      path: path,
      addresses: addresses
    });

    this.createBlockchain(addresses);
  }

  createBlockchain(addresses) {
    // create genesis tx
    // This is a hack because I've not yet figured out how to properly sign coinbase txs w/ BitcoinCash.transaction
    let genesisBlock = [];
    addresses.forEach((address, index) => {
      let privkey = BitcoinCash.fromWIF(addresses[0].privateKeyWIF, this.wallet.network);
      let tx = BitcoinCash.transactionBuilder(this.wallet.network);

      // Hardcode the input hash
      tx.addInput("4a5e1e4baab89f3a32518a88c31bc87f618f76673e2cc77ab2127b7afdeda33b", 0);

      let addy = BitcoinCash.fromWIF(address.privateKeyWIF, this.wallet.network).getAddress();
      // send 12.5 BCH to the first newly generated account
      let value = BitcoinCash.toSatoshi(12.5);

      tx.addOutput(addy, value);
      tx.sign(0, privkey);
      let rawHex = tx.build().toHex();
      genesisBlock.push({
        rawHex: rawHex,
        timestamp: Date.now()
      });
    });

    this.miner.pushGenesisBlock(genesisBlock);
  }

  resetBitbox() {
    this.blockchain = new Blockchain();

    // Miner Utility for handling txs and blocks
    this.miner = new Miner(this.blockchain, this.utxoSet, this.wallet.network);

    let [mnemonic, path, addresses] = BitcoinCash.createHDWallet(this.wallet);
    store.set('addresses', addresses);
    this.setState({
      mnemonic: mnemonic,
      path: path,
      addresses: addresses
    });
    this.createBlockchain(addresses);
    this.handleBlockchainUpdate(this.blockchain);
  }

  handlePathMatch(path) {
    if(path === '/' || path === '/blocks' || path === '/transactions' || path === '/configuration/accounts-and-keys') {
      return true;
    } else {
      return false;
    }
  }

  handleBlockchainUpdate(blockchainInstance) {
    this.setState({
      blockchainInstance: blockchainInstance
    })
  }

  handleUtxoUpdate(utxoSet) {
    this.setState({
      utxoSet: utxoSet
    })
  }

  handleEntropySliderChange(value) {
    this.wallet.entropy = value;
  }

  handleConfigChange(value, id) {
    if(id === 'mnemonic') {
      this.wallet.mnemonic = value;
    } else if (id === 'path') {
      this.wallet.path = value;
    } else if (id === 'password') {
      this.wallet.password = value;
    } else if (id === 'totalAccounts') {
      this.wallet.totalAccounts = value;
    }
    store.set('wallet', this.wallet);
  }

  handleConfigToggle(value, id) {
    if(id === 'displayTestnet') {
      if(value) {
        this.wallet.network = 'testnet';
      } else {
        this.wallet.network = 'bitcoin';
      }
      this.wallet.displayTestnet = value;
    } else if(id === 'displayCashaddr') {

      this.wallet.displayCashaddr = value;
    } else if(id === 'autogenerateMnemonic') {

      this.wallet.autogenerateMnemonic = value;
    } else if(id === 'autogeneratePath') {

      this.wallet.autogeneratePath = value;
    } else if(id === 'usePassword') {

      this.wallet.usePassword = value;
    }
    store.set('wallet', this.wallet);
  }

  createBlock() {
    let blockchainInstance = this.state.blockchainInstance;

    let keyPair = BitcoinCash.fromWIF(this.state.addresses[0].privateKeyWIF, this.wallet.network);
    let address = keyPair.getAddress();
    let ripemd160 = Crypto.createRIPEMD160Hash(address);

    let output = new Output({
      value: 5000000000,
      ripemd160: ripemd160
    });

    let tx = new Transaction({
      versionNumber: 1,
      inputs: [],
      outputs: [output],
      time: Date.now(),
      address: address
    }, true);

    let block = {
      hash: '0x000000000019d6689c085ae165831e934ff763ae46a2a6c172b3f1b60a8ce26f',
      version: 1,
      hashPrevBlock: '00000000000000',
      hashMerkleRoot: '0x4a5e1e4baab89f3a32518a88c31bc87f618f76673e2cc77ab2127b7afdeda33b',
      time: Date.now(),
      bits: '0x1d00ffff',
      nonce: '2083236893',
      vtx: 1,
      index: blockchainInstance.chain.length,
      transactions: [tx],
      previousHash: blockchainInstance.getLatestBlock().blockheader.hashMerkleRoot
    };

    blockchainInstance.addBlock(new Block(block));
    let utxoSet = this.state.utxoSet;
    utxoSet.addUtxo(address, output.value);
    this.handleBlockchainUpdate(blockchainInstance);
    this.handleUtxoUpdate(utxoSet);
  }

  render() {

    const pathMatch = (match, location) => {
      if (!match) {
        return false
      }
      return this.handlePathMatch(match.path);
    }

    let list = []
    if (this.state.addresses.length) {
      this.state.addresses.forEach(address => {
        list.push(<li>Address: {address} | Balance: 0 | TX Count: 0 |</li>);
      });
    }

    const WalletPage = (props) => {
      return (
        <WalletDisplay
          mnemonic={this.state.mnemonic}
          path={this.state.path}
          blockchainInstance={this.state.blockchainInstance}
          addresses={this.state.addresses}
          utxoSet={this.state.utxoSet}
          displayCashaddr={this.state.displayCashaddr}
          wallet={this.wallet}
        />
      );
    };

    const BlocksPage = (props) => {
      return (
        <Blocks
          match={props.match}
          blockchainInstance={this.state.blockchainInstance}
          handleBlockchainUpdate={this.handleBlockchainUpdate.bind(this)}
          handleUtxoUpdate={this.handleUtxoUpdate.bind(this)}
          addresses={this.state.addresses}
          utxoSet={this.state.utxoSet}
        />
      );
    };

    const BlockPage = (props) => {
      return (
        <BlockDetails
          blockchainInstance={this.state.blockchainInstance}
          match={props.match}
          wallet={this.wallet}
        />
      );
    };

    const AddressPage = (props) => {
      return (
        <AddressDisplay
          blockchainInstance={this.state.blockchainInstance}
          match={props.match}
        />
      );
    };

    const TransactionsPage = (props) => {
      return (
        <TransactionsDisplay
          blockchainInstance={this.state.blockchainInstance}
          match={props.match}
          wallet={this.wallet}
        />
      );
    };

    const ConvertPage = (props) => {
      return (
        <ConvertDisplay
          wallet={this.wallet}
        />
      );
    };

    const MessagePage = (props) => {
      return (
        <MessageDisplay
          addresses={this.state.addresses}
        />
      );
    };

    const ConfigurationPage = (props) => {
      return (
        <ConfigurationDisplay
          match={props.match}
          resetBitbox={this.resetBitbox.bind(this)}
          handleEntropySliderChange={this.handleEntropySliderChange.bind(this)}
          wallet={this.wallet}
          handleConfigToggle={this.handleConfigToggle.bind(this)}
          handleConfigChange={this.handleConfigChange.bind(this)}
        />
      );
    };

    let chainlength = 0;
    if(this.state.blockchainInstance.chain) {
      chainlength = this.state.blockchainInstance.chain.length - 1;
    }
              // <li className="pure-menu-item">
              //   <button className='pure-button danger-background' onClick={this.createBlock.bind(this)}><i className="fas fa-cube"></i> Create block</button>
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
                    to="/message">
                    <i className="far fa-check-circle"></i> Sign &amp; Verify
                  </NavLink>
                </li>
              </ul>
              <ul className="pure-menu-list right">
                <li className="pure-menu-item">
                  <NavLink
                    isActive={pathMatch}
                    activeClassName="pure-menu-selected"
                    className="pure-menu-link"
                    to="/configuration/accounts-and-keys">
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
            <Switch>
              <Route exact path="/blocks" component={BlocksPage}/>
              <Route path="/blocks/:block_id" component={BlockPage}/>
              <Route path="/transactions/:transaction_id" component={TransactionsPage}/>
              <Route path="/convert" component={ConvertPage}/>
              <Route path="/message" component={MessagePage}/>
              <Route path="/configuration" component={ConfigurationPage}/>
              <Route exact path="/" component={WalletPage}/>
              <Redirect from='*' to='/' />
            </Switch>
          </div>
        </Router>
      </Provider>
    );
  }
}

export default App;
