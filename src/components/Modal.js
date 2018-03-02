import React, { Component } from 'react';
import BitcoinCash from '../utilities/BitcoinCash';

class Modal extends Component {
  hideAccountModal(account) {
    this.props.hideAccountModal(account);
  }

  render() {

    return (
      <div id="keyModal" className="modal">
        <div className="modal-content">
          <div className="modal-header">
            <span onClick={this.hideAccountModal.bind(this, this.props.account)} className="close">&times;</span>
            <h2><i className="fas fa-qrcode" /> {this.props.configuration.displayCashaddr ? this.props.account.cashAddr : this.props.account.legacy}</h2>
          </div>
          <div className="modal-body">
            <h3><i className="fas fa-key" /> Private Key WIF</h3>
            <p>{this.props.account.privateKeyWIF}</p>
            <h4><i className="fas fa-lock" /> Extended Private</h4>
            <p>{this.props.account.xpriv}</p>
            <h4><i className="fas fa-lock-open" /> Extended Public</h4>
            <p>{this.props.account.xpub}</p>
          </div>
        </div>
      </div>
    );
  }
}

export default Modal;
