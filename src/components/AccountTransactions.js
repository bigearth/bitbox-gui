import React, { Component } from 'react';
import underscore from 'underscore';
class AccountTransactions extends Component {
  render() {
    let account = underscore.findWhere(this.props.wallet.accounts, {index: +this.props.match.params.account_id});
    // let extendedPublicKeys = [];
    // for(let i = 0; i <= 4; i++) {
    //   let xpub = bitbox.BitcoinCash.fromXPub(account.xpub, i);
    //   console.log(xpub);
    //   extendedPublicKeys.push(<li key={i}>xpub</li>);
    // }
    return (
      <div className="AccountTransactions">

      account txs
      </div>
    );
  }
}

export default AccountTransactions;
