import React, { Component } from 'react';
import BitcoinCash from '../utilities/BitcoinCash';

class SignAndVerify extends Component {
  handleSubmit(event) {
    event.preventDefault();
  }

  handleClear(formId) {
    if(formId === 'sign') {
      this.props.updateValue('message1', '');
      this.props.updateValue('address1', '');
      this.props.updateValue('signature1', '');
      this.props.updateValue('message1Success', '');
      this.props.updateValue('message1Error', '');
    } else {
      this.props.updateValue('message2', '');
      this.props.updateValue('address2', '');
      this.props.updateValue('signature2', '');
      this.props.updateValue('message2Success', '');
      this.props.updateValue('message2Error', '');
    }
  }

  handleInputChange(e) {
    let value = e.target.value;
    let id = e.target.id;
    this.props.updateValue(id, value);
  }

  signMessage() {
    this.props.updateValue('message1Success', '');
    this.props.updateValue('message1Error', '');

    let privateKeyWIF = BitcoinCash.returnPrivateKeyWIF(this.props.signAndVerify.address1, this.props.wallet.accounts);
    if(privateKeyWIF === 'Received an invalid Bitcoin Cash address as input.') {
      this.props.updateValue('message1Success', '');
      this.props.updateValue('message1Error', privateKeyWIF);
      return false;
    }

    let signature = bitbox.BitcoinCash.signMessageWithPrivKey(privateKeyWIF, this.props.signAndVerify.message1);
    this.props.updateValue('signature1', signature);
  }

  verifyMessage() {
    this.props.updateValue('message2Success', '');
    this.props.updateValue('message2Error', '');

    let address = bitbox.BitcoinCash.toLegacyAddress(this.props.signAndVerify.address2);
    let signature = this.props.signAndVerify.signature2;
    let message = this.props.signAndVerify.message2;
    let verified;
    let error = false;
    try {
      verified = bitbox.BitcoinCash.verifyMessage(address, signature, message)
    }
    catch (e) {
      error = true;
      this.props.updateValue('message2Success', '');
      this.props.updateValue('message2Error', e.message);
    }

    if(!error) {
      if(verified) {
        this.props.updateValue('message2Success', 'true');
        this.props.updateValue('message2Error', '');
      } else {
        this.props.updateValue('message2Error', 'Failed to verify message: Invalid signature');
        this.props.updateValue('message2Success', '');
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
              <input id="address1" type='text' value={this.props.signAndVerify.address1} onChange={this.handleInputChange.bind(this)}/>
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
              <input id="address2" type='text' value={this.props.signAndVerify.address2} onChange={this.handleInputChange.bind(this)}/>
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
