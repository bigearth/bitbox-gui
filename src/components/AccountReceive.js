import React, { Component } from 'react';
import underscore from 'underscore';
class AccountReceive extends Component {
  render() {
    let account = underscore.findWhere(this.props.wallet.accounts, {index: +this.props.match.params.account_id});
    // let extendedPublicKeys = [];
    // for(let i = 0; i <= 4; i++) {
    //   let xpub = bitbox.BitcoinCash.fromXPub(account.xpub, i);
    //   console.log(xpub);
    //   extendedPublicKeys.push(<li key={i}>xpub</li>);
    // }

    let oldXpub = bitbox.BitcoinCash.fromXPub(account.xpub, 0);
    let freshXpub = bitbox.BitcoinCash.fromXPub(account.xpub, 1);
    return (
      <div className="AccountReceive">
        <h2><i className="fas fa-chevron-right" /> Receive Bitcoin Cash</h2>
        <h3><i className="fas fa-chevron-right" /> Previous Addresses</h3>
        <ul>
          <li>
            {oldXpub}
          </li>
        </ul>
        <h3><i className="fas fa-chevron-right" /> Fresh Addresses</h3>
        <ul>
          <li>
            {freshXpub}
          </li>
        </ul>
        <button>More Addresses</button>
      </div>
    );
  }
}

export default AccountReceive;
