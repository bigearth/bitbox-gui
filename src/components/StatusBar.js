import React, { Component } from 'react';
import moment from 'moment';
import {
  withRouter
} from 'react-router-dom';

import Block from '../models/Block';
import Transaction from '../models/Transaction';
import Output from '../models/Output';
import Input from '../models/Input';
import underscore from 'underscore';

class StatusBar extends Component {

  createBlock() {
    let accounts = this.props.wallet.accounts;
    let blockchain = this.props.blockchain;
    let previousBlock = underscore.last(blockchain.chain) || {};
    let newIndex
    if(previousBlock.index || previousBlock.index === 0) {
      newIndex = previousBlock.index + 1;
    } else {
      newIndex = 0;
    }


    let walletConfig = this.props.configuration.wallet;

    let account1 = this.props.wallet.accounts[0];
    let account2 = this.props.wallet.accounts[1];

    let alice = bitbox.BitcoinCash.fromWIF(account1.privateKeyWIF)
    let txb = bitbox.BitcoinCash.transactionBuilder(walletConfig.network)
    txb.addInput('61d520ccb74288c96bc1a2b20ea1c0d5a704776dd0164a396efec3ea7040349d', 0);
    let value = 1250000000;
    txb.addOutput(account2.legacy, value);
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
        value: value,
        rawHex: hex,
        timestamp: Date(),
        hash: bitbox.Crypto.createSHA256Hash(hex),
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
      this.props.addBlock(newChain);
      this.props.updateStore();

      account1.previousAddresses.push(account1.freshAddresses.shift());
      let newCashAddr = bitbox.BitcoinCash.fromXPub(account1.xpub, account1.previousAddresses.length);
      account1.cashAddr = newCashAddr;
      account1.legacy = bitbox.BitcoinCash.Address.toLegacyAddress(newCashAddr);
      account1.freshAddresses.push(account1.cashAddr)
      this.props.updateAccount(account1);
    }, (err) => { console.log(err);
    });
    // utxoSet.addUtxo(address, output.value);
    // this.handleUtxoUpdate(utxoSet);
  }

  render() {
    return (
      <div className="pure-menu pure-menu-horizontal networkInfo">
        <ul className="pure-menu-list">
          <li className="pure-menu-item">
            CURRENT BLOCK <br />
            {this.props.blockchain.chain.length}
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
    );
  }
}

export default withRouter(StatusBar);
