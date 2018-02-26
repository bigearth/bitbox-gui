import React, { Component } from 'react';
import BitcoinCash from '../utilities/BitcoinCash';

class ModalDisplay extends Component {
  constructor(props) {
    super(props);
  }

  hideKey() {
    this.props.hideKey();
  }

  render() {

    let address;
    if(this.props.wallet.displayCashaddr) {
      address = BitcoinCash.toCashAddress(this.props.address);
    } else {
      address = this.props.address;
    }

    return (
      <div id="keyModal" className="modal">
        <div className="modal-content">
          <div className="modal-header">
            <span onClick={this.hideKey.bind(this)} className="close">&times;</span>
            <h2><i className="fas fa-qrcode" /> {address}</h2>
          </div>
          <div className="modal-body">
            <h3><i className="fas fa-key" /> Private Key WIF</h3>
            <p>{this.props.privateKeyWIF}</p>
            <h4><i className="fas fa-lock" /> Extended Private</h4>
            <p>{this.props.xpriv}</p>
            <h4><i className="fas fa-lock-open" /> Extended Public</h4>
            <p>{this.props.xpub}</p>
          </div>
        </div>
      </div>
    );
  }
}

export default ModalDisplay;
