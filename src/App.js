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
import Input from './models/Input';
import Utxo from './models/Utxo';
import Wallet from './models/Wallet';

// custom components
import WalletDisplay from './components/WalletDisplay';
import Blocks from './components/Blocks';
import BlockDetails from './components/BlockDetails';
// import AddressDetails from './components/AddressDetails';
import TransactionsDisplay from './components/TransactionsDisplay';
import Configuration from './components/Configuration';

// utilities
import Crypto from './utilities/Crypto';
import BitcoinCash from './utilities/BitcoinCash';
import Miner from './utilities/Miner';

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

    this.blockchain = new Blockchain();

    // Miner Utility for handling txs and blocks
    this.miner = new Miner(this.blockchain);

    this.state = {
      mnemonic: this.wallet.mnemonic,
      addresses: [],
      blockchainInstance: this.blockchain,
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
  createBlockchain(addresses) {

    // create new tx
    // let input = new Input({
    //   txid: "d18e7106e5492baf8f3929d2d573d27d89277f3825d3836aa86ea1d843b5158b",
    //   vout: 0,
    //   scriptSig : "3045022100884d142d86652a3f47ba4746ec719bbfbd040a570b1deccbb6498c75c4ae24cb02204b9f039ff08df09cbe9f6addac960298cad530a863ea8f53982c09db8f6e3813[ALL] 0484ecc0d46f1918b30928fa0e4ed99f16a0fb4fde0735e7ade8416ab9fe423cc5412336376789d172787ec3457eee41c04f4938de5cc17b4a10fa336a8d752adf"
    // });
    // let output1 = new Output({
    //   "value": 0.01500000,
    //   "scriptPubKey": "OP_DUP OP_HASH160 ab68025513c3dbd2f7b92a94e0581f5d50f654e7 OP_EQUALVERIFY OP_CHECKSIG"
    // });
    //
    // let output2 = new Output({
    //   "value": 0.08450000,
    //   "scriptPubKey": "OP_DUP OP_HASH160 7f9b1a7fb68d60c536c2fd8aeaa53a8f3cc025a8 OP_EQUALVERIFY OP_CHECKSIG",
    // });
    //
    // let t = new Transaction({
    //   inputs: [input],
    //   outputs: [output1, output2]
    // })
    // end create new tx

    // create genesis tx
    // This is a hack because I've not yet figured out how to properly sign coinbase txs w/ BitcoinCash.transaction
    let privkey = BitcoinCash.fromWIF(addresses[0].privateKeyWIF, this.wallet.network);
    let tx = BitcoinCash.transactionBuilder(this.wallet.network);

    // Hardcode the input hash
    // tx.addInput(new Buffer('74bcc32d18744f0e3a8b48941de0ba64f84ebdda4c060ef35a10531446562962', 'hex'), 1);
    tx.addInput("192b889c434a2872e3719109fad1e9943bce5a3457e4af200944825c32322413", 1);

    // send 12.5 BCH to the first newly generated account
    tx.addOutput(BitcoinCash.fromWIF(addresses[1].privateKeyWIF, this.wallet.network).getAddress(), BitcoinCash.toSatoshi(12.5));
    tx.sign(0, privkey);
    let rawHex = tx.build().toHex();
    this.miner.pushGenesisTx(rawHex);

    //
    // // create new tx
    // let input = new Input({
    //   txid: "d18e7106e5492baf8f3929d2d573d27d89277f3825d3836aa86ea1d843b5158b",
    //   vout: 0,
    //   scriptSig : "3045022100884d142d86652a3f47ba4746ec719bbfbd040a570b1deccbb6498c75c4ae24cb02204b9f039ff08df09cbe9f6addac960298cad530a863ea8f53982c09db8f6e3813[ALL] 0484ecc0d46f1918b30928fa0e4ed99f16a0fb4fde0735e7ade8416ab9fe423cc5412336376789d172787ec3457eee41c04f4938de5cc17b4a10fa336a8d752adf"
    // });
    // let output1 = new Output({
    //   "value": 0.01500000,
    //   "scriptPubKey": "OP_DUP OP_HASH160 ab68025513c3dbd2f7b92a94e0581f5d50f654e7 OP_EQUALVERIFY OP_CHECKSIG"
    // });
    //
    // let output2 = new Output({
    //   "value": 0.08450000,
    //   "scriptPubKey": "OP_DUP OP_HASH160 7f9b1a7fb68d60c536c2fd8aeaa53a8f3cc025a8 OP_EQUALVERIFY OP_CHECKSIG",
    // });
    //
    // let t = new Transaction({
    //   inputs: [input],
    //   outputs: [output1, output2]
    // })
    // // end create new tx


    // create coinbase tx
    // let coinbase = BitcoinCash.fromWIF(addresses[0].privateKeyWIF);
    // let txb = BitcoinCash.transactionBuilder();
    //
    // txb.addInput(Crypto.createSHA256Hash(genesisTx), 0);
    // // f5a5ce5988cc72b9b90e8d1d6c910cda53c88d2175177357cc2f2cf0899fbaad
    // txb.addOutput(addresses[1].publicKey, 12000);
    //
    // txb.sign(0, coinbase)
    // let txHex = txb.build().toHex();
    // let txHash = Crypto.createSHA256Hash(txHex);
    // end create coinbase tx

    // Create new tx
    // let t = BitcoinCash.transaction();
    // let tb = BitcoinCash.transactionBuilder();
    // let coinbaseTx = new t();
    //
    // // coinbase input w/ hash of 0
    // let coinbaseInputHex = new Buffer('0000000000000000000000000000000000000000000000000000000000000000', 'hex');
    // coinbaseTx.addInput(coinbaseInputHex, 0);
    //
    // // single output
    // // get address of first account
    // let coinbaseOutputAddress = BitcoinCash.fromWIF(addresses[0].privateKeyWIF, this.wallet.network).getAddress();
    //
    // // Hex of output address
    // let coinbaseOutputHex = new Buffer(coinbaseOutputAddress, 'hex');
    // coinbaseTx.addOutput(coinbaseOutputHex, BitcoinCash.toSatoshi(12.5));
    //
    // let foo = tb.fromTransaction(coinbaseTx);
    // let txHex = coinbaseTx.toHex();
    // create genesis tx

    let keyPair = BitcoinCash.fromWIF(addresses[0].privateKeyWIF, this.wallet.network);
    let address = keyPair.getAddress();
    let output = new Output({
      value: 5000000000
    });

    let genesisTx = new Transaction({
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

    // this.handleBlockchainUpdate(this.state.blockchainInstance);
    this.handleUtxoUpdate(utxoSet);
  }

  resetBitbox() {
    this.blockchain = new Blockchain();

    // Miner Utility for handling txs and blocks
    this.miner = new Miner(this.blockchain);

    let [mnemonic, path, addresses] = BitcoinCash.createHDWallet(this.wallet);
    this.setState({
      mnemonic: mnemonic,
      path: path,
      addresses: addresses
    });
    this.createBlockchain(addresses);
    this.handleBlockchainUpdate(this.blockchain);
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
          wallet={this.wallet}
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
        <TransactionsDisplay
          blockchainInstance={this.state.blockchainInstance}
          match={props.match}
          wallet={this.wallet}
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
              // <li className="pure-menu-item">
              //   <button className='pure-button danger-background' onClick={this.createBlock.bind(this)}><i className="fas fa-cube"></i> Create block</button>
              // </li>

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
            </ul>
          </div>
          <Switch>
            <Route exact path="/blocks" component={BlocksPage}/>
            <Route path="/blocks/:block_id" component={BlockPage}/>
            <Route path="/transactions/:transaction_id" component={TransactionsPage}/>
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
