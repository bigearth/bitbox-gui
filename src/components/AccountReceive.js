import React, { Component } from 'react';
import underscore from 'underscore';
import QRCode from 'qrcode.react';

class AccountReceive extends Component {
  moreAddresses() {

  }
  render() {
    let account = underscore.findWhere(this.props.wallet.accounts, {index: +this.props.match.params.account_id});
    let extendedPublicKeys = [];
    account.previousAddresses.forEach((address, i) => {
      extendedPublicKeys.push(<li key={i}>/{i} {address}</li>);
    })
    let freshXpub = bitbox.BitcoinCash.fromXPub(account.xpub, account.previousAddresses.length);
    return (
      <div className="AccountReceive content pure-g">
        <div className="pure-u-1-2">
          <h2><i className="fas fa-chevron-right" /> Receive Bitcoin Cash</h2>
          <h3><i className="far fa-clock" /> Fresh Addresses</h3>
          <ul>
            <li>
              /{account.previousAddresses.length} {freshXpub}
            </li>
          </ul>
          <h3><i className="fas fa-clock" /> Previous Addresses</h3>
          <ul>
            {extendedPublicKeys}
          </ul>
        </div>
        <div className="pure-u-1-2 qr">
          <p><QRCode value={account.cashAddr} /></p>
          <p><code>m / 44&rsquo; / 145&rsquo; / {account.index}&rsquo; / 0 / {account.previousAddresses.length}</code></p>
        </div>
      </div>
    );
  }
}

export default AccountReceive;
