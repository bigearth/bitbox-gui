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
      let a = bitbox.BitcoinCash.address();
      let s = Bitcoin.script;
      let ecpair = bitbox.BitcoinCash.ECPair();
      this.props.wallet.accounts.forEach((account) => {

        // update tx count
        let txCount = 0;
        this.props.blockchain.chain.forEach((block, index) => {
          block.transactions.forEach((tx, indx) => {
            // check all inputs/outputs in each block to see if they are from/to account
            tx.inputs.forEach((input) => {
              if(input.scriptSig !== undefined) {
                let chunksIn = s.decompile(new Buffer(input.scriptSig.hex, 'hex'));
                let address = ecpair.fromPublicKeyBuffer(chunksIn[1]).getAddress();

                account.addresses.chains.forEach((chain, indx) => {
                  chain.addresses.forEach((addy, ind) => {
                    if(this.props.configuration.displayCashaddr) {
                      addy = bitbox.Address.toCashAddress(addy);
                    }
                    if(address === addy) {
                      // if so increment account tx count
                      txCount += 1;
                    }
                  });
                });
              }
            });

            tx.outputs.forEach((output) => {
              let address = output.scriptPubKey.addresses[0];

              account.addresses.chains.forEach((chain, indx) => {
                chain.addresses.forEach((addy, ind) => {
                  if(this.props.configuration.displayCashaddr) {
                    addy = bitbox.Address.toCashAddress(addy);
                  }
                  if(address === addy) {
                    // if so increment account tx count
                    txCount += 1;
                  }
                });
              });
            });

          });
        });

        list.push(
          <Account
            account={account}
            txCount={txCount}
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
