import React, { Component } from 'react';
import underscore from 'underscore';
import QRCode from 'qrcode.react';

class AccountReceive extends Component {
  constructor(props) {
    super(props);
    this.account = underscore.findWhere(this.props.wallet.accounts, {index: +this.props.match.params.account_id});
    this.account.freshAddresses = [];
    this.account.freshAddresses.push(bitbox.BitcoinCash.fromXPub(this.account.xpub, 0));
    this.props.updateAccount(this.account);
  }

  moreAddresses(account) {
    account.freshAddresses.push(bitbox.BitcoinCash.fromXPub(account.xpub, account.freshAddresses.length));
    this.props.updateAccount(account);
  }

  render() {
    let freshAddresses = [];
    let previousAddresses = [];

    this.account.freshAddresses.forEach((address, i) => {
      freshAddresses.push(<li key={i}>
        /{this.account.previousAddresses.length + i} {this.props.configuration.displayCashaddr ? address : bitbox.BitcoinCash.Address.toLegacyAddress(address)}<br />
      </li>);
    })

    this.account.previousAddresses.forEach((address, i) => {
      previousAddresses.push(<li key={i}>
        /{i} {this.props.configuration.displayCashaddr ? address : bitbox.BitcoinCash.Address.toLegacyAddress(address)}<br />
        <span className='totalReceived'>Total received: 0 BCH</span>
      </li>);
    })
    return (
      <div className="AccountReceive content pure-g">
        <div className="pure-u-1-2">
          <h2><i className="fas fa-qrcode" /> Receive Bitcoin Cash</h2>
          <h3><i className="far fa-clock" /> Fresh Addresses</h3>
          <ul>
            {freshAddresses}
          </ul>
          <button className='pure-button pure-button-primary' onClick={this.moreAddresses.bind(this, this.account)}>More Addresses</button>

          <h3><i className="fas fa-clock" /> Previous Addresses</h3>
          <ul>
            {previousAddresses}
          </ul>
        </div>
        <div className="pure-u-1-2 qr">
          <p><QRCode value={this.props.configuration.displayCashaddr ? this.account.cashAddr : bitbox.BitcoinCash.Address.toLegacyAddress(this.account.cashAddr)} /></p>
          <p><code>m / 44&rsquo; / 145&rsquo; / {this.account.index}&rsquo; / 0 / {this.account.previousAddresses.length}</code></p>
        </div>
      </div>
    );
  }
}

export default AccountReceive;
