import React, { Component } from 'react';
import underscore from 'underscore';
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
      <div className="AccountReceive">
        <h2><i className="fas fa-chevron-right" /> Receive Bitcoin Cash</h2>
        <h3><i className="fas fa-chevron-right" /> Previous Addresses</h3>
        <ul>
          {extendedPublicKeys}
        </ul>
        <h3><i className="fas fa-chevron-right" /> Fresh Addresses</h3>
        <ul>
          <li>
            /{account.previousAddresses.length} {freshXpub}
          </li>
        </ul>
      </div>
    );
  }
}

export default AccountReceive;
