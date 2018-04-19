import React, { Component } from 'react';
import underscore from 'underscore';
import FontAwesomeIcon from '@fortawesome/react-fontawesome';
import faChevronUp from '@fortawesome/fontawesome-free-solid/faChevronUp';

class AccountSend extends Component {
  handleSubmit(e) {
    let walletConfig = this.props.configuration;
    let xpriv = this.props.wallet.accounts[0].xpriv;
    let hdnode = bitbox.HDNode.fromXPriv(xpriv);

    let account = underscore.findWhere(this.props.wallet.accounts, {index: +this.props.match.params.account_id});
    console.log(account.addresses)
    let changeAddress = account.addresses.getChainAddress(1);
    // bump change address
    account.addresses.nextChainAddress(1);

    let transactionBuilder = new bitbox.TransactionBuilder('bitcoincash');
    let keyPair = hdnode.keyPair;
    let txid = this.props.blockchain.chain[0].transactions[0].txid;
    transactionBuilder.addInput(txid, 0, keyPair);
    // get byte count to calculate fee. paying 1 sat/byte
    let byteCount = bitbox.BitcoinCash.getByteCount({ P2PKH: 1 }, { P2PKH: 1 });
    // original amount of satoshis in vin
    let originalAmount = bitbox.BitcoinCash.toSatoshi(this.props.accountSend.amount);
    // amount to send to receiver. It's the original amount - 1 sat/byte for tx size
    let sendAmount = originalAmount - byteCount;
    // add output w/ address and amount to send
    transactionBuilder.addOutput(this.props.accountSend.to, sendAmount);
    transactionBuilder.addOutput(changeAddress, bitbox.BitcoinCash.toSatoshi(1212));
    transactionBuilder.sign(0, originalAmount);
    // build tx
    let tx = transactionBuilder.build();
    // output rawhex
    let hex = tx.toHex();
    console.log(hex)

    // // add to mempool
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
          <h2><FontAwesomeIcon icon={faChevronUp} /> Send Bitcoin Cash</h2>

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
