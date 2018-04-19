import React, { Component } from 'react';
import BitcoinCash from '../utilities/BitcoinCash';
import FontAwesomeIcon from '@fortawesome/react-fontawesome';
import faQrcode from '@fortawesome/fontawesome-free-solid/faQrcode';
import faKey from '@fortawesome/fontawesome-free-solid/faKey';
import faLock from '@fortawesome/fontawesome-free-solid/faLock';
import faLockOpen from '@fortawesome/fontawesome-free-solid/faLockOpen';

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
            <h2><FontAwesomeIcon icon={faQrcode} /> {this.props.configuration.displayCashaddr ? bitbox.Address.toCashAddress(address) : address}</h2>
          </div>
          <div className="modal-body">
            <h3><FontAwesomeIcon icon={faKey} /> Private Key WIF</h3>
            <p>{privateKeyWIF}</p>
            <h4><FontAwesomeIcon icon={faLock} /> Extended Private</h4>
            <p>{xpriv}</p>
            <h4><FontAwesomeIcon icon={faLockOpen} /> Extended Public</h4>
            <p>{xpub}</p>
          </div>
        </div>
      </div>
    );
  }
}

export default AccountModal;
