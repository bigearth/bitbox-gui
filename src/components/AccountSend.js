import React, { Component } from 'react';
import underscore from 'underscore';
class AccountSend extends Component {

  handleSubmit(e) {
    let walletConfig = this.props.configuration;

    let privateKeyWIF = this.props.wallet.accounts[0].privateKeyWIF;
    let account2 = this.props.wallet.accounts[1];

    let account1 = bitbox.BitcoinCash.Address.fromWIF(privateKeyWIF)
    let txb = bitbox.BitcoinCash.transactionBuilder(walletConfig.network)
    txb.addInput('61d520ccb74288c96bc1a2b20ea1c0d5a704776dd0164a396efec3ea7040349d', 0);
    let amount = this.props.accountSend.amount;
    txb.addOutput(bitbox.BitcoinCash.Address.toLegacyAddress(this.props.accountSend.to), bitbox.BitcoinCash.toSatoshi(amount));
    txb.sign(0, account1)
    let hex = txb.build().toHex();
    bitbox.RawTransactions.decodeRawTransaction(hex)
    .then((result) => {
      console.log('woohoo', result)
    });

    e.preventDefault();
  }

  handleInputChange(e) {
    let value = e.target.value;
    let id = e.target.id;
    this.props.updateAccountSendValue(id, value);
  }

  render() {

    return (
      <div className="AccountSend content pure-g">
        <div className="pure-u-1-1">
          <h2><i className="fas fa-chevron-right" /> Send Bitcoin Cash</h2>

          <form className="pure-form pure-form-aligned" onSubmit={this.handleSubmit.bind(this)}>
              <fieldset>
                  <div className="pure-control-group">
                      <label htmlFor="address">Address</label>
                      <input onChange={this.handleInputChange.bind(this)} id="to" type="text" placeholder="Address" />
                  </div>

                  <div className="pure-control-group">
                      <label htmlFor="password">Amount</label>
                      <input onChange={this.handleInputChange.bind(this)} id="amount" type="number" placeholder="Amount" />
                  </div>

                  <div className="pure-control-group">
                      <label htmlFor="email">Fee</label>
                      <input onChange={this.handleInputChange.bind(this)} id="fee" type="number" placeholder="Fee" />
                  </div>
                  <div className="pure-controls">
                      <button type="submit" className="pure-button pure-button-primary">Submit</button>
                  </div>
              </fieldset>
          </form>
        </div>
      </div>
    );
  }
}

export default AccountSend;
