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
    let mempool = this.props.mempool;
    let blockchain = this.props.blockchain;
    let previousBlock = underscore.last(blockchain.chain) || {};

    let blockData = {
      index: this.props.blockchain.chain.length,
      transactions: [],
      timestamp: Date()
    };

    let account1 = this.props.wallet.accounts[0];
    let account2 = this.props.wallet.accounts[1];

    let alice = bitbox.HDNode.fromWIF(account1.privateKeyWIF);
    let txb = bitbox.BitcoinCash.transactionBuilder(this.props.configuration.wallet.network);
    txb.addInput('61d520ccb74288c96bc1a2b20ea1c0d5a704776dd0164a396efec3ea7040349d', 0);
    let value = 1250000000;
    let addy = account1.addresses.getChainAddress(0);
    txb.addOutput(addy, value);
    txb.sign(0, alice);
    let hex = txb.build().toHex();
    // add tx to mempool
    this.props.addTx(hex);

    // bump address counter to next address
    account1.addresses.nextChainAddress(0);
    this.props.updateAccount(account1);

    mempool.transactions.forEach((tx, index) => {
      bitbox.RawTransactions.decodeRawTransaction(tx)
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
        let total = 0;
        result.outs.forEach((vout, index) => {
          total += vout.value;
          outputs.push(new Output({
            hex: vout.hex,
            outputPubKey: vout.outputPubKey,
            script: vout.script,
            value: vout.value
          }));
        })

        let transaction = new Transaction({
          value: total,
          rawHex: tx,
          timestamp: Date(),
          hash: bitbox.Crypto.createSHA256Hash(tx),
          inputs: inputs,
          outputs: outputs
        });

        blockData.transactions.push(transaction);

        if((index + 1) === mempool.transactions.length) {
          let block = new Block(blockData)
          block.previousBlockHeader = previousBlock.header || "#BCHForEveryone";
          block.header = bitbox.Crypto.createSHA256Hash(`${block.index}${block.previousBlockHeader}${JSON.stringify(block.transactions)}${block.timestamp}`);
          this.props.mineBlock(blockchain.chain.push(block));
        }
      }, (err) => { console.log(err);
      });
    })
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
