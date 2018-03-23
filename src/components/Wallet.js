import React, { Component } from 'react';
import BitcoinCash from '../utilities/BitcoinCash';
import Bitcoin from 'bitcoinjs-lib';
import Account from './Account';
import AccountModal from './AccountModal';
import underscore from 'underscore';
import '../styles/wallet.scss';

class Wallet extends Component {
  constructor(props) {
    super(props);

    this.state = {
      showAccountModal: false,
      account: {}
    }
  }

  showAccountModal(account) {
    this.props.toggleDisplayAccount(account);
    this.setState({
      showAccountModal: true,
      account: account
    });
  }

  hideAccountModal(account) {
    this.props.toggleDisplayAccount(account);
    this.setState({
      showAccountModal: false,
      account: {}
    });
  }

  render() {
    let list = [];
    if(this.props.wallet && this.props.wallet.accounts && this.props.wallet.accounts.length) {
      this.props.wallet.accounts.forEach((account) => {
        // get balances
        // let publicKey = BitcoinCash.fromWIF(account.privateKeyWIF, this.props.configuration.network).getAddress();
        // let ripemd160 = bitbox.Crypto.createRIPEMD160Hash(publicKey);

        // let outputs = [];
        // underscore.each(this.props.utxoSet.outputs, (output, index) => {
        //   if(output.address === publicKey) {
        //     outputs.push(output);
        //   }
        // });
        // // let outputs = underscore.where(this.props.utxoSet, {accountuuu: publicKey});
        // let balance = 0;
        //  underscore.each(outputs, (output, index) => {
        //    balance += output.value;
        //  });
        //
        // // get transactions
        // let transactions = [];
        // underscore.each(this.props.blockchainInstance.chain, (block, index) => {
        //   underscore.each(block.transactions, (transaction, index) => {
        //     let t = bitbox.BitcoinCash.transaction();
        //     let decodedTx = t.fromHex(transaction.rawHex);
        //     let a = BitcoinCash.address();
        //
        //     let s = BitcoinCash.script();
        //     let ins = [];
        //     let outs = [];
        //     let ecpair = BitcoinCash.ECPair();
        //     decodedTx.ins.forEach((input, index) => {
        //       let chunksIn = s.decompile(input.script);
        //       let inputPubKey = ecpair.fromPublicKeyBuffer(chunksIn[1], Bitcoin.networks[this.props.wallet.network]).getAddress();
        //       ins.push(inputPubKey);
        //     })
        //
        //     decodedTx.outs.forEach((output, index) => {
        //       let outputPubKey = a.fromOutputScript(output.script, Bitcoin.networks[this.network]);
        //       outs.push(outputPubKey);
        //     })
        //
        //     ins.forEach((input, ind) => {
        //       if(input === publicKey) {
        //        transactions.push(input);
        //       }
        //     });
        //
        //     outs.forEach((output, ind) => {
        //       if(output === publicKey) {
        //        transactions.push(output);
        //       }
        //     });
        //   });
        // });
        //
        // let transactionsCount = transactions.length;

        list.push(
          <Account
            account={account}
            key={account.index}
            displayCashaddr={this.props.configuration.displayCashaddr}
            showAccountModal={this.showAccountModal.bind(this)}
            configuration={this.props.configuration}
          />
        );
      });
    }

    let modal;
    if(this.state.showAccountModal === true) {
      modal = <AccountModal
        account={this.state.account}
        hideAccountModal={this.hideAccountModal.bind(this)}
        configuration={this.props.configuration}
      />;
    }

    let HDPath = `m/${this.props.configuration.HDPath.purpose}/${this.props.configuration.HDPath.coinCode}`;

    return (
      <div className="Wallet content pure-g">
        <div className="pure-u-1-1">
          {modal}

          <ul className='subheader'>
            <li className=''><strong>MNEMONIC</strong></li>
            <li className='right'><strong>HD PATH</strong></li>
          </ul>
          <ul className='subheader'>
            <li className='content-head'>{this.props.configuration.mnemonic}</li>
            <li className='content-head right'>{HDPath}/account_index&rsquo;/0/address_index</li>
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

export default Wallet;
