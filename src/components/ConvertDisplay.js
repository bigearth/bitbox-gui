import React, { Component } from 'react';
import BitcoinCash from '../utilities/BitcoinCash';
var QRCode = require('qrcode.react');


class Convert extends Component {
  constructor(props) {
    super(props);

    this.state = {
      cashaddr: '',
      base58Check: ''
    }
  }

  convert(e) {
    let value = e.target.value;
    this.setState({
      cashaddr: '',
      base58Check: ''
    })
    let cashaddr = BitcoinCash.toCashAddress(value);
    let base58Check = BitcoinCash.toLegacyAddress(value);

    this.setState({
      cashaddr: cashaddr,
      base58Check: base58Check
    })
  }

  render() {
    let cashaddrQR;
    let base58CheckQR;
    if(this.state.cashaddr !== '') {
      cashaddrQR = <QRCode value={this.state.cashaddr} />;
    }

    if(this.state.base58Check !== '') {
      base58CheckQR = <QRCode value={this.state.base58Check} />;
    }
    return (
      <div className="Convert">
        <h2 className="content-head is-center">Converter</h2>
        <div className="pure-g">
          <div className="l-box-lrg pure-u-1-1">
            <p>Paste in an address to convert legacy or cashaddr addresses and generate a QR code.</p>
            <form className="pure-form pure-form-stacked">
              <input id='path' type='text' placeholder='enter legacy or cashaddr address' onChange={this.convert.bind(this)} />;
            </form>
          </div>
        </div>
        <div className="pure-g">
          <div className="pure-u-1-2">
            <h3>{this.state.cashaddr}</h3>
            <p>{cashaddrQR}</p>
          </div>
          <div className="pure-u-1-2">
            <h3>{this.state.base58Check}</h3>
            <p>{base58CheckQR}</p>
          </div>
        </div>
      </div>
    );
  }
}

export default Convert;
