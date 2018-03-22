import React, { Component } from 'react';
import BitcoinCash from '../utilities/BitcoinCash';

class AccountModal extends Component {
  hideAccountModal(account) {
    this.props.hideAccountModal(account);
  }

  render() {
    let address = this.props.account.addresses.getChainAddress(0);
    let addressHeight = this.props.account.addresses.chains[0].find(bitbox.Address.toLegacyAddress(address))
    let hdNode = bitbox.HDNode.fromXPriv(this.props.account.xpriv);
    let childNode = hdNode.derivePath(`0/${addressHeight}`);
    let privateKeyWIF = bitbox.HDNode.toWIF(childNode);
    let xpriv = bitbox.HDNode.toXPriv(childNode);
    let xpub = bitbox.HDNode.toXPub(childNode);


    return (
      <div id="keyAccountModal" className="modal">
        <div className="modal-content">
          <div className="modal-header">
            <span onClick={this.hideAccountModal.bind(this, this.props.account)} className="close">&times;</span>
            <h2><i className="fas fa-qrcode" /> {this.props.configuration.displayCashaddr ? bitbox.Address.toCashAddress(address) : address}</h2>
          </div>
          <div className="modal-body">
            <h3><i className="fas fa-key" /> Private Key WIF</h3>
            <p>{privateKeyWIF}</p>
            <h4><i className="fas fa-lock" /> Extended Private</h4>
            <p>{xpriv}</p>
            <h4><i className="fas fa-lock-open" /> Extended Public</h4>
            <p>{xpub}</p>
          </div>
        </div>
      </div>
    );
  }
}

export default AccountModal;
