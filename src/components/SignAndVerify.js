import React, { Component } from 'react';
import BitcoinCash from '../utilities/BitcoinCash';

class SignAndVerify extends Component {
  constructor(props) {
    super(props);
    this.handleClear('verify');
    this.handleClear('sign');
  }

  handleSubmit(event) {
    event.preventDefault();
  }

  handleClear(formId) {
    if(formId === 'sign') {
      this.props.updateSignAndVerifyValue('message1', '');
      this.props.updateSignAndVerifyValue('signAddress', '');
      this.props.updateSignAndVerifyValue('signature1', '');
      this.props.updateSignAndVerifyValue('message1Success', '');
      this.props.updateSignAndVerifyValue('message1Error', '');
    } else {
      this.props.updateSignAndVerifyValue('message2', '');
      this.props.updateSignAndVerifyValue('verifyAddress', '');
      this.props.updateSignAndVerifyValue('signature2', '');
      this.props.updateSignAndVerifyValue('message2Success', '');
      this.props.updateSignAndVerifyValue('message2Error', '');
    }
  }

  handleInputChange(e) {
    let value = e.target.value;
    let id = e.target.id;
    this.props.updateSignAndVerifyValue(id, value);
  }

  signMessage() {
    this.props.updateSignAndVerifyValue('message1Success', '');
    this.props.updateSignAndVerifyValue('message1Error', '');

    let privateKeyWIF
    try {
      privateKeyWIF = BitcoinCash.returnPrivateKeyWIF(this.props.signAndVerify.signAddress, this.props.wallet.accounts);
    }
    catch (e) {
      this.props.updateSignAndVerifyValue('message1Success', '');
      this.props.updateSignAndVerifyValue('message1Error', e.message);
    }

    if(privateKeyWIF === 'Received an invalid Bitcoin Cash address as input.') {
      this.props.updateSignAndVerifyValue('message1Success', '');
      this.props.updateSignAndVerifyValue('message1Error', privateKeyWIF);
      return false;
    }

    let signature = bitbox.BitcoinCash.signMessageWithPrivKey(privateKeyWIF, this.props.signAndVerify.message1);
    this.props.updateSignAndVerifyValue('signature1', signature);
  }

  verifyMessage() {
    this.props.updateSignAndVerifyValue('message2Success', '');
    this.props.updateSignAndVerifyValue('message2Error', '');

    let address;
    let error = false;
    try {
      address = bitbox.BitcoinCash.Address.toLegacyAddress(this.props.signAndVerify.verifyAddress);
    }
    catch (e) {
      error = true;
      this.props.updateSignAndVerifyValue('message2Success', '');
      this.props.updateSignAndVerifyValue('message2Error', e.message);
    }

    let signature = this.props.signAndVerify.signature2;
    let message = this.props.signAndVerify.message2;
    console.log('priv', address, signature, message)
    let verified;
    try {
      verified = bitbox.BitcoinCash.verifyMessage(address, signature, message)
    }
    catch (e) {
      error = true;
      this.props.updateSignAndVerifyValue('message2Success', '');
      this.props.updateSignAndVerifyValue('message2Error', e.message);
    }

    if(!error) {
      if(verified) {
        this.props.updateSignAndVerifyValue('message2Success', 'true');
        this.props.updateSignAndVerifyValue('message2Error', '');
      } else {
        this.props.updateSignAndVerifyValue('message2Error', 'Failed to verify message: Invalid signature');
        this.props.updateSignAndVerifyValue('message2Success', '');
      }
    }
  }

  render() {
    let success1;
    let success2;
    let error1;
    let error2;

    if(this.props.signAndVerify.message1Success !== '') {
      success1 = <p className='success'>Valid message</p>;
    }

    if(this.props.signAndVerify.message2Success !== '') {
      success2 = <p className='success'>Valid message</p>;
    }

    if(this.props.signAndVerify.message1Error !== '') {
      error1 = <p className='danger'>{this.props.signAndVerify.message1Error}</p>;
    }

    if(this.props.signAndVerify.message2Error !== '') {
      error2 = <p className='danger'>{this.props.signAndVerify.message2Error}</p>;
    }

    return (
      <div className="SignAndVerify">
        <h2 className="content-head is-center">Sign &amp; Verify</h2>
        <div className="pure-g">
          <div className="l-box-lrg pure-u-1-2">
            <h3>Sign Message</h3>
            <form className="pure-form pure-form-stacked" onSubmit={this.handleSubmit}>
              <label>Message</label>
              <textarea id="message1" value={this.props.signAndVerify.message1} onChange={this.handleInputChange.bind(this)}></textarea>
              <label>Address</label>
              <input id="signAddress" type='text' value={this.props.signAndVerify.signAddress} onChange={this.handleInputChange.bind(this)}/>
              <label>Signature</label>
              <textarea readOnly id="signature1" value={this.props.signAndVerify.signature1} onChange={this.handleInputChange.bind(this)}></textarea>
            </form>
            <button className="pure-button" onClick={this.handleClear.bind(this, 'sign')}>Clear</button>
            <button className="pure-button" onClick={this.signMessage.bind(this)}>Sign</button>
            {success1}
            {error1}
          </div>
          <div className="l-box-lrg pure-u-1-2">
            <h3>Verify Message</h3>
            <form className="pure-form pure-form-stacked" onSubmit={this.handleSubmit}>
              <label>Message</label>
              <textarea id="message2" value={this.props.signAndVerify.message2} onChange={this.handleInputChange.bind(this)}></textarea>
              <label>Address</label>
              <input id="verifyAddress" type='text' value={this.props.signAndVerify.verifyAddress} onChange={this.handleInputChange.bind(this)}/>
              <label>Signature</label>
              <textarea id="signature2" value={this.props.signAndVerify.signature2} onChange={this.handleInputChange.bind(this)}></textarea>
            </form>
            <button className="pure-button" onClick={this.handleClear.bind(this, 'verify')}>Clear</button>
            <button className="pure-button" onClick={this.verifyMessage.bind(this)}>Verify</button>
            {success2}
            {error2}
          </div>
        </div>
      </div>
    );
  }
}

export default SignAndVerify;
