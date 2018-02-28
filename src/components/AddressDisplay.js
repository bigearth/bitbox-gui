import React, { Component } from 'react';
import BitcoinCash from '../utilities/BitcoinCash';
// import Crypto from '../utilities/Crypto';

class AddressDisplay extends Component {
  constructor(props) {
    super(props);
    let privateKeyWIF = this.props.address.privateKeyWIF;
    let address = BitcoinCash.fromWIF(privateKeyWIF, this.props.wallet.network).getAddress();
    this.state = {
      address: address
    }
  }

  showKey(address, privateKeyWIF, xpriv, xpub) {
    this.props.showKey(address, privateKeyWIF, xpriv, xpub);
  }

  render() {
    let address;

    if(this.props.wallet.displayCashaddr) {
      address = <span>{BitcoinCash.toCashAddress(this.state.address)}</span>;
    } else {
      address = <span>{this.state.address}</span>;
    }

    let coinbase;
    if(this.props.index === 0) {
      coinbase = <span> <i className="fas fa-asterisk" /> Coinbase</span>
    }

    return (
      <tr className="AddressDisplay">
        <td className='important'><span className='subheader'>ADDRESS{coinbase}</span> <br />{address}</td>
        <td className='important'><span className='subheader'>BALANCE</span> <br />{BitcoinCash.toBitcoinCash(this.props.balance)} BCH</td>
        <td><span className='subheader'>TX COUNT</span> <br />{this.props.transactionsCount}</td>
        <td><span className='subheader'>INDEX</span> <br />{this.props.index}</td>
        <td><button className="pure-button" onClick={this.showKey.bind(this, this.state.address, this.props.address.privateKeyWIF, this.props.address.xpriv, this.props.address.xpub)}><i className="fas fa-key" /></button></td>
      </tr>
    );
  }
}

export default AddressDisplay;
