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
