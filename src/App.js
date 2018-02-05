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
import Blockchain from './models/Blockchain';
import Block from './models/Block';
import Transaction from './models/Transaction';
import Output from './models/Output';
import Utxo from './models/Utxo';
import Wallet from './models/Wallet';

// custom components
import WalletDisplay from './components/WalletDisplay';
import Blocks from './components/Blocks';
import BlockDetails from './components/BlockDetails';
// import AddressDetails from './components/AddressDetails';
import Transactions from './components/Transactions';
import Configuration from './components/Configuration';

// utilities
import Crypto from './utilities/Crypto';
import BitcoinCash from './utilities/BitcoinCash';

// css
import './styles/app.scss';

class App extends Component {

  constructor(props) {
    super(props);

    // Create HD wallet w/ default configuration
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

    this.state = {
      mnemonic: this.wallet.mnemonic,
      addresses: [],
      blockchainInstance: '',
      utxoSet: new Utxo(),
      password: '',
      showCreateBtn: false
    };
  }

  componentDidMount() {
    let [mnemonic, path, addresses] = BitcoinCash.createHDWallet(this.wallet);
    let config = this.state.configuration;
    this.setState({
      mnemonic: mnemonic,
      path: path,
      addresses: addresses,
      configuration: config
    });
    this.createBlockchain(addresses);
  }

  // rng() {
  //   return Buffer.from('YT8dAtK4d16A3P1z+TpwB2jJ4aFH3g9M1EioIBkLEV4=', 'base64')
  // }
  //
  createBlockchain(addresses) {

  //   // // create new tx
  //   // let owner = Bitcoin.ECPair.fromWIF(addresses[1].privateKeyWIF);
  //   // let newTxb = new Bitcoin.TransactionBuilder();
  //   //
  //   // newTxb.addInput(txHash, 0);
  //   // newTxb.addOutput(addresses[2].publicKey, 12000);
  //   // newTxb.sign(0, owner)
  //   // let newTxHex = newTxb.build().toHex();
  //
  //   // let testnet = Bitcoin.networks.testnet;
  //   // var txb = new Bitcoin.TransactionBuilder(testnet)
  //   // var alice1 = Bitcoin.ECPair.makeRandom({ network: testnet })
  //   // var aliceChange = Bitcoin.ECPair.makeRandom({ rng: this.rng, network: testnet })
  //   //
  //   //
  //
  //   // GetHash()      =
  //   // hashMerkleRoot = 0x4a5e1e4baab89f3a32518a88c31bc87f618f76673e2cc77ab2127b7afdeda33b
  //   // txNew.vin[0].scriptSig     = 486604799 4 0x736B6E616220726F662074756F6C69616220646E6F63657320666F206B6E697262206E6F20726F6C6C65636E61684320393030322F6E614A2F33302073656D695420656854
  //   // txNew.vout[0].nValue       = 5000000000
  //   // txNew.vout[0].scriptPubKey = 0x5F1DF16B2B704C8A578D0BBAF74D385CDE12C11EE50455F3C438EF4C3FBCF649B6DE611FEAE06279A60939E028A8D65C10B73071A6F16719274855FEB0FD8A6704 OP_CHECKSIG
  //   // block.nVersion = 1
  //   // block.nTime    = 1231006505
  //   // block.nBits    = 0x1d00ffff
  //   // block.nNonce   = 2083236893
  //   //
  //   //
  //   // CBlock(hash=000000000019d6, ver=1, hashPrevBlock=00000000000000, hashMerkleRoot=4a5e1e, nTime=1231006505, nBits=1d00ffff, nNonce=2083236893, vtx=1)
  //   //   CTransaction(hash=4a5e1e, ver=1, vin.size=1, vout.size=1, nLockTime=0)
  //   //     CTxIn(COutPoint(000000, -1), coinbase 04ffff001d0104455468652054696d65732030332f4a616e2f32303039204368616e63656c6c6f72206f6e206272696e6b206f66207365636f6e64206261696c6f757420666f722062616e6b73)
  //   //     CTxOut(nValue=50.00000000, scriptPubKey=0x5F1DF16B2B704C8A578D0B)
  //   // vMerkleTree: 4a5e1e
    let keyPair = BitcoinCash.fromWIF(addresses[0].privateKeyWIF, this.wallet.network);
    let address = keyPair.getAddress();
    let ripemd160 = Crypto.createRIPEMD160Hash(address);
    let output = new Output({
      value: 5000000000,
      ripemd160: ripemd160
    });

    let genesisTx = new Transaction({
      versionNumber: 1,
      inputs: [],
      outputs: [output],
      time: Date.now(),
      address: address
    }, true);

    let genesisBlock = {
      hash: '0x000000000019d6689c085ae165831e934ff763ae46a2a6c172b3f1b60a8ce26f',
      version: 1,
      hashPrevBlock: '00000000000000',
      hashMerkleRoot: '0x4a5e1e4baab89f3a32518a88c31bc87f618f76673e2cc77ab2127b7afdeda33b',
      time: 1231006505,
      bits: '0x1d00ffff',
      nonce: '2083236893',
      vtx: 1,
      index: 0,
      transactions: [genesisTx],
      previousHash: '00000000000000'
    };
    let blockchainInstance = new Blockchain(genesisBlock);

    let utxoSet = this.state.utxoSet;
    utxoSet.addUtxo(address, genesisBlock.transactions[0].outputs[0].value);
  //   // let coinbase = BitcoinCash.fromWIF(addresses[0].privateKeyWIF);
  //   // let txb = BitcoinCash.transactionBuilder();
  //   //
  //   // txb.addInput(Crypto.createSHA256Hash(genesisTx), 0);
  //   // // f5a5ce5988cc72b9b90e8d1d6c910cda53c88d2175177357cc2f2cf0899fbaad
  //   // txb.addOutput(addresses[1].publicKey, 12000);
  //   //
  //   // txb.sign(0, coinbase)
  //   // let txHex = txb.build().toHex();
  //   // let txHash = Crypto.createSHA256Hash(txHex);
  //
    this.handleBlockchainUpdate(blockchainInstance);
    this.handleUtxoUpdate(utxoSet);
  }

  resetBitbox() {
    let [mnemonic, path, addresses] = BitcoinCash.createHDWallet(this.wallet);
    this.setState({
      mnemonic: mnemonic,
      path: path,
      addresses: addresses
    });
    this.createBlockchain(addresses);
  }

  handlePathMatch(path) {
    if(path === '/' || path === '/blocks' || path === '/transactions' || path === '/logs' || path === '/configuration/accounts-and-keys') {
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
        />
      );
    };

    const AddressPage = (props) => {
      return (
        <AddressDetails
          blockchainInstance={this.state.blockchainInstance}
          match={props.match}
        />
      );
    };

    const TransactionsPage = (props) => {
      return (
        <Transactions
          addresses={this.state.addresses}
        />
      );
    };

    const ConfigurationPage = (props) => {
      return (
        <Configuration
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

  //   // <Route path="/addresses/:address_id" component={AddressPage}/>
            // <Route path="/transactions" component={TransactionsPage}/>
          // <Switch>
          //   <Route exact path="/blocks" component={BlocksPage}/>
          //   <Route path="/blocks/:block_id" component={BlockPage}/>
          //   <Route path="/configuration" component={ConfigurationPage}/>
          //   <Route exact path="/" component={WalletDisplayPage}/>
          //   <Redirect from='*' to='/' />
          // </Switch>
    return (
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
              <li className="pure-menu-item">
                <button className='pure-button danger-background' onClick={this.createBlock.bind(this)}><i className="fas fa-cube"></i> Create block</button>
              </li>
            </ul>
          </div>
          <Switch>
            <Route exact path="/blocks" component={BlocksPage}/>
            <Route path="/blocks/:block_id" component={BlockPage}/>
            <Route path="/configuration" component={ConfigurationPage}/>
            <Route exact path="/" component={WalletPage}/>
            <Redirect from='*' to='/' />
          </Switch>
        </div>
      </Router>
    );
  }
}

export default App;
