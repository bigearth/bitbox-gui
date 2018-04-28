import BitcoinCash from './BitcoinCash'
import underscore from 'underscore';
import reduxStore from './ReduxStore'
import Block from '../models/Block';
import Transaction from '../models/Transaction';
import Output from '../models/Output';
import Input from '../models/Input';
import Bitcoin from 'bitcoinjs-lib';

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

import {
  createUtxo,
  addUtxo
} from '../actions/UtxoActions';


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

    // utxo set
    // reduxStore.dispatch(createUtxo());
  }

  static createAccounts() {
    let walletConfig = reduxStore.getState().configuration.wallet;

    if(walletConfig.autogenerateHDMnemonic) {
      // create a random mnemonic w/ user provided entropy size
      let randomBytes = bitbox.Crypto.randomBytes(walletConfig.entropy);
      walletConfig.mnemonic = bitbox.Mnemonic.fromEntropy(randomBytes, bitbox.Mnemonic.wordLists()[walletConfig.language]);
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

  static createCoinbaseTx() {
    let account1 = reduxStore.getState().wallet.accounts[0];
    let baddress = Bitcoin.address;
    let walletConfig = reduxStore.getState().configuration.wallet;
    let tx = new Bitcoin.Transaction('bitcoin');

    tx.version = 1;
    tx.locktime = 0;

    let txHash = Buffer.from('0000000000000000000000000000000000000000000000000000000000000000', 'hex');
    let scriptSig = Buffer.from(bitbox.Crypto.sha256('#BCHForEveryone'), 'hex');
    tx.addInput(txHash, 4294967295, 4294967295, scriptSig)

    let network;
    if(walletConfig.network === 'bitcoin') {
      network = Bitcoin.networks.bitcoin;
    } else {
      network = Bitcoin.networks.testnet;
    }
    let value = bitbox.BitcoinCash.toSatoshi(12.5);
    let address = account1.addresses.getChainAddress(0);
    let scriptPubKey = baddress.toOutputScript(address, network);
    tx.addOutput(scriptPubKey, value)

    let hex = tx.toHex();

    // add tx to mempool
    reduxStore.dispatch(addTx(hex));

  }

  static mineBlock() {
    console.log('mining block')

    let a = bitbox.BitcoinCash.address();
    let script = bitbox.Script;
    let ecpair = bitbox.ECPair;
    let state = reduxStore.getState();
    let blockchain = state.blockchain;
    let accounts = state.wallet.accounts;
    let mempool = state.mempool;
    let configuration = state.configuration.wallet;
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
          let config = {
            sequence: vin.sequence
          };

          if(vin.coinbase) {
            config.coinbase = vin.coinbase;
          } else {
            config.scriptSig = vin.scriptSig;
            config.txid = vin.txid;
            config.vout = vin.vout;
            // update balances
            // console.log('scriptSig', config.scriptSig.hex)
            let chunksIn = script.decompileHex(config.scriptSig.hex);
            let address = ecpair.fromPublicKeyBuffer(chunksIn[1]).getAddress();

            accounts.forEach((account) => {
              let derivedNode = account.addresses.derive(bitbox.Address.toLegacyAddress(address))
              if(derivedNode) {
                account.balance -= 0;
                account.sent += 0;
                account.txCount += 1;
                reduxStore.dispatch(updateAccount(account));
              }
            })
          }

          let input = new Input(config);
          inputs.push(input);

        })

        let value = 0;
        let outputs = [];
        result.vout.forEach((vout, index) => {
          value += vout.value;
          let output = new Output({
            scriptPubKey: vout.scriptPubKey,
            value: vout.value
          });
          outputs.push(output);

          // update balances
          // get address from output scriptPubKey
          let address = output.scriptPubKey.addresses[0];
          // for each utxo loop over account's previous and fresh addresses
          accounts.forEach((account) => {
            let derivedNode = account.addresses.derive(bitbox.Address.toLegacyAddress(address))
            if(derivedNode) {
              account.balance += output.value;
              account.received += output.value;
              account.txCount += 1;
              account.addresses.nextChainAddress(0);
              reduxStore.dispatch(updateAccount(account));
            }
          })
          //
          // reduxStore.dispatch(addUtxo(vout));
        })

        let tx = new Transaction({
          size: result.size,
          vsize: result.vsize,
          value: value,
          rawHex: hex,
          timestamp: Date(),
          txid: result.txid,
          inputs: inputs,
          outputs: outputs,
          hash: bitbox.Crypto.sha256(hex).toString('hex')
        });

        blockData.transactions.push(tx);

        if((index + 1) === mempool.transactions.length) {
          let block = new Block(blockData)
          let previousBlock = underscore.last(blockchain.chain) || {};
          block.previousBlockHeader = previousBlock.header || "#BCHForEveryone";
          block.header = bitbox.Crypto.sha256(`${block.index}${block.previousBlockHeader}${JSON.stringify(block.transactions)}${block.timestamp}`).toString('hex');

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
}

export default Miner;
