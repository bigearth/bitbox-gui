import React, { Component } from 'react';
import BitcoinCash from '../utilities/BitcoinCash';
// import Crypto from '../utilities/Crypto';

class AddressDetails extends Component {
  constructor(props) {
    super(props);
    let privateKeyWIF = this.props.address.privateKeyWIF;
    let address = BitcoinCash.fromWIF(privateKeyWIF).getAddress();
    this.state = {
      address: address,
      showPrivKey: false
    }
  }

  showKey(key) {
    this.setState({
      address: key,
      showPrivKey: true
    });
  }

  hideKey(key) {
    this.setState({
      showPrivKey: false,
      address: key
    });
  }

  render() {
    let btn;
    let address;
    if(this.state.showPrivKey) {

      btn = <td><button className="pure-button danger-background" onClick={this.hideKey.bind(this, BitcoinCash.fromWIF(this.state.address).getAddress())}><i className="fas fa-key" /></button></td>;
      address = <span className='danger'>{this.state.address}</span>;
    } else {
      btn = <td><button className="pure-button" onClick={this.showKey.bind(this, this.props.address.privateKeyWIF)}><i className="fas fa-key" /></button></td>;

      if(this.props.displayCashaddr) {
        address = <span className='success'>{BitcoinCash.toCashAddress(this.state.address)}</span>;
      } else {
        address = <span className='success'>{this.state.address}</span>;
      }
    }

    let coinbase;
    if(this.props.index === 0) {
      coinbase = <span> <i className="fas fa-asterisk" /> Coinbase</span>
    }

    return (
      <tr className="AddressDetails">
        <td className='important'><span className='subheader'>ADDRESS{coinbase}</span> <br />{address}</td>
        <td className='important'><span className='subheader'>BALANCE</span> <br />{BitcoinCash.toBitcoinCash(this.props.balance)} BCH</td>
        <td><span className='subheader'>TX COUNT</span> <br />{this.props.transactionsCount}</td>
        <td><span className='subheader'>INDEX</span> <br />{this.props.index}</td>
        {btn}
      </tr>
    );
  }
}

export default AddressDetails;
