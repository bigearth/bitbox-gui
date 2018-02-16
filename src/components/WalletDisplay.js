import React, { Component } from 'react';
import BitcoinCash from '../utilities/BitcoinCash';
import Crypto from '../utilities/Crypto';
import Bitcoin from 'bitcoinjs-lib';
import AddressDisplay from './AddressDisplay';
import underscore from 'underscore';

class WalletDisplay extends Component {
  render() {
    let list = [];
    if (this.props.addresses.length) {
      this.props.addresses.forEach((address, index) => {
        // get balances
        let publicKey = BitcoinCash.fromWIF(address.privateKeyWIF, this.props.wallet.network).getAddress();
        let ripemd160 = Crypto.createRIPEMD160Hash(publicKey);

        let outputs = [];
        underscore.each(this.props.utxoSet.outputs, (output, index) => {
          if(output.address === publicKey) {
            outputs.push(output);
          }
        });
        // let outputs = underscore.where(this.props.utxoSet, {address: publicKey});
        let balance = 0;
         underscore.each(outputs, (output, index) => {
           balance += output.value;
         });

        // get transactions
        let transactions = [];
        underscore.each(this.props.blockchainInstance.chain, (block, index) => {
          underscore.each(block.transactions, (transaction, index) => {
            let t = BitcoinCash.transaction();
            let decodedTx = t.fromHex(transaction.rawHex);
            let a = BitcoinCash.address();

            let s = BitcoinCash.script();
            let ins = [];
            let outs = [];
            let ecpair = BitcoinCash.ECPair();
            decodedTx.ins.forEach((input, index) => {
              let chunksIn = s.decompile(input.script);
              let inputPubKey = ecpair.fromPublicKeyBuffer(chunksIn[1], Bitcoin.networks[this.props.wallet.network]).getAddress();
              ins.push(inputPubKey);
            })

            decodedTx.outs.forEach((output, index) => {
              let outputPubKey = a.fromOutputScript(output.script, Bitcoin.networks[this.network]);
              outs.push(outputPubKey);
            })

            ins.forEach((input, ind) => {
              if(input === publicKey) {
               transactions.push(input);
              }
            });

            outs.forEach((output, ind) => {
              if(output === publicKey) {
               transactions.push(output);
              }
            });
          });
        });

        let transactionsCount = transactions.length;

        list.push(
          <AddressDisplay
            address={address}
            index={index}
            key={index}
            balance={balance}
            transactionsCount={transactionsCount}
            displayCashaddr={this.props.displayCashaddr}
            wallet={this.props.wallet}
          />
        );
      });
    }

    return (
      <div className="WalletDisplay content pure-g">
        <div className="pure-u-1-1">
          <ul className='subheader'>
            <li className=''>MNEMONIC</li>
            <li className='right'>HD PATH</li>
          </ul>
          <ul className='subheader'>
            <li className='content-head'>{this.props.mnemonic}</li>
            <li className='content-head right'>{this.props.path.replace(/\/$/, "")}/account_index&rsquo;</li>
          </ul>
          <table className="pure-table">
            <tbody>
              {list}
            </tbody>
          </table>
        </div>
      </div>
    );
  }
}

export default WalletDisplay;
