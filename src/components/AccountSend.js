import React, { Component } from 'react';
import underscore from 'underscore';
class AccountSend extends Component {

  handleSubmit(e) {
    let walletConfig = this.props.configuration;
    let xpriv = this.props.wallet.accounts[0].xpriv;
    let accountNode = bitbox.HDNode.fromXPriv(xpriv)
    let childNode = accountNode.derivePath("0/0");
    let txb = bitbox.BitcoinCash.transactionBuilder(walletConfig.network)
    let amount = this.props.accountSend.amount;

    txb.addInput(this.props.blockchain.chain[0].transactions[0].txid, 0);
    txb.addOutput(bitbox.Address.toLegacyAddress(this.props.accountSend.to), bitbox.BitcoinCash.toSatoshi(amount));
    txb.sign(0, childNode)
    let hex = txb.build().toHex();

    // add to mempool
    this.props.addTx(hex);

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
          <h2><i className="fas fa-chevron-up" /> Send Bitcoin Cash</h2>

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
