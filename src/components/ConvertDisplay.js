import React, { Component } from 'react';
import BitcoinCash from '../utilities/BitcoinCash';
var QRCode = require('qrcode.react');


class ConvertDisplay extends Component {
  constructor(props) {
    super(props);

    this.state = {
      cashaddr: '',
      base58Check: '',
      error: false,
      errorMsg: '',
      privateKeyWIF: ''
    }
  }

  convert(e) {
    let value = e.target.value;
    let cashaddr = '';
    let base58Check = '';
    let error;
    let errorMsg;
    let publicKey = '';
    let privateKeyWIF = '';

    try {
      publicKey = BitcoinCash.fromWIF(value, this.props.wallet.network).getAddress();
    }
    catch (e) {
      try {
        cashaddr = BitcoinCash.toCashAddress(value);
        base58Check = BitcoinCash.toLegacyAddress(value);
      }
      catch (e) {
        error = true;
        errorMsg = 'Invalid address';
      }
    }

    if(publicKey !== '') {
      cashaddr = BitcoinCash.toCashAddress(publicKey);
      base58Check = BitcoinCash.toLegacyAddress(publicKey);
      privateKeyWIF = value;
    }

    this.setState({
      cashaddr: cashaddr,
      base58Check: base58Check,
      error: error,
      errorMsg: errorMsg,
      privateKeyWIF: privateKeyWIF
    })
  }

  render() {
    let conversion;
    let privateKeyWIF;
    if(this.state.base58Check !== '' && this.state.cashaddr !== '') {
      conversion = <div className="pure-g">
          <div className="pure-u-1-2 alignLeft">
            <h3>CashAddr</h3>
            <p><QRCode value={this.state.cashaddr} /></p>
            <p>{this.state.cashaddr}</p>
          </div>
          <div className="pure-u-1-2 alignRight">
            <h3>Legacy base58Check</h3>
            <p><QRCode value={this.state.base58Check} /></p>
            <p>{this.state.base58Check}</p>
          </div>
        </div>
    }

    if(this.state.privateKeyWIF !== '') {
      privateKeyWIF =
        <div className="pure-g">
          <div className="pure-u-1-1 alignLeft">
            <h3>Private Key WIF</h3>
            <p><QRCode value={this.state.privateKeyWIF} /></p>
            <p>{this.state.privateKeyWIF}</p>
          </div>
        </div>;
    }

    let error;
    if(this.state.error) {
      error =
        <div className="pure-g">
          <div className="pure-u-1-1">
            <h3>Error</h3>
            <p>{this.state.errorMsg}</p>
          </div>
        </div>;
    }
    return (
      <div className="ConvertDisplay">
        <h2 className="content-head is-center">Converter</h2>
        <div className="pure-g">
          <div className="l-box-lrg pure-u-1-1">
            <p>Paste in a public address or private key in Wallet Import Format to convert legacy or cashaddr addresses and generate a QR code.</p>
            <form className="pure-form pure-form-stacked">
              <input id='path' type='text' placeholder='enter legacy or cashaddr address' onChange={this.convert.bind(this)} />
            </form>
          </div>
        </div>
        {error}
        {conversion}
        {privateKeyWIF}
      </div>
    );
  }
}

export default ConvertDisplay;
