import React, { Component } from 'react';
import BitcoinCash from '../utilities/BitcoinCash';
var QRCode = require('qrcode.react');

class Convert extends Component {
  constructor(props) {
    super(props);
    this.props.createConvert();
  }

  convert(e) {
    let inputValue = e.target.value;
    let keyPair = '';
    let cashaddr = this.props.convert.cashaddr;
    let base58Check = this.props.convert.base58Check;
    let error = this.props.convert.error;
    let errorMsg = this.props.convert.errorMsg;
    let privateKeyWIF = this.props.convert.privateKeyWIF;
    this.props.updateValue('inputValue', inputValue);
    this.props.updateValue('error', null);
    this.props.updateValue('errorMsg', '');
    try {
      keyPair = BitcoinCash.fromWIF(inputValue, this.props.configuration.network);
      privateKeyWIF = inputValue;
      this.props.updateValue('privateKeyWIF', inputValue);

      cashaddr = bitbox.BitcoinCash.toCashAddress(keyPair.getAddress());
      this.props.updateValue('cashaddr', cashaddr);

      base58Check = bitbox.BitcoinCash.toLegacyAddress(keyPair.getAddress());
      this.props.updateValue('base58Check', base58Check);
    }
    catch (e) {
      try {
        cashaddr = bitbox.BitcoinCash.toCashAddress(inputValue);
        this.props.updateValue('cashaddr', cashaddr);

        base58Check = bitbox.BitcoinCash.toLegacyAddress(inputValue);
        this.props.updateValue('base58Check', base58Check);
      }
      catch (e) {
        error = true;
        this.props.updateValue('error', error);
        errorMsg = 'Invalid address';
        this.props.updateValue('errorMsg', errorMsg);

        this.props.updateValue('privateKeyWIF', '');
        this.props.updateValue('cashaddr', '');
        this.props.updateValue('base58Check', '');
      }
    }
  }

  render() {
    let conversion;
    let privateKeyWIF;
    if(this.props.convert.base58Check !== '' && this.props.convert.cashaddr !== '') {
      conversion = <div className="pure-g">
          <div className="pure-u-1-2 alignLeft">
            <h3>CashAddr</h3>
            <p><QRCode value={this.props.convert.cashaddr} /></p>
            <p>{this.props.convert.cashaddr}</p>
          </div>
          <div className="pure-u-1-2 alignRight">
            <h3>Legacy base58Check</h3>
            <p><QRCode value={this.props.convert.base58Check} /></p>
            <p>{this.props.convert.base58Check}</p>
          </div>
        </div>
    }

    if(this.props.convert.privateKeyWIF !== '') {
      privateKeyWIF =
        <div className="pure-g">
          <div className="pure-u-1-1 alignLeft">
            <h3>Private Key WIF</h3>
            <p><QRCode value={this.props.convert.privateKeyWIF} /></p>
            <p>{this.props.convert.privateKeyWIF}</p>
          </div>
        </div>;
    }

    let error;
    if(this.props.convert.error) {
      error =
        <div className="pure-g">
          <div className="pure-u-1-1">
            <h3>Error</h3>
            <p>{this.props.convert.errorMsg}</p>
          </div>
        </div>;
    }
    return (
      <div className="Convert">
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

export default Convert;
