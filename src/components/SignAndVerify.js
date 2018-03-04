import React, { Component } from 'react';
import BitcoinCash from '../utilities/BitcoinCash';

class SignAndVerify extends Component {
  constructor(props) {
    super(props);

    this.state = {
      message1: '',
      address1: '',
      signature1: '',
      message2: '',
      address2: '',
      signature2: '',
      message1Error: '',
      message2Error: '',
      message1Success: '',
      message2Success: ''
    }
  }
  handleClear(formId) {
    if(formId === 'sign') {
      this.setState({
        message1: '',
        address1: '',
        signature1: '',
        message1Success: '',
        message1Error: ''
      });
    } else {
      this.setState({
        message2: '',
        address2: '',
        signature2: '',
        message2Success: '',
        message2Error: ''
      });
    }
  }

  handleInputChange(e) {
    let value = e.target.value;
    let id = e.target.id;
    let obj = {};
    obj[id] = value;
    this.setState(obj)
  }

  signMessage() {
    this.setState({
      message1Success: '',
      message1Error: ''
    })

    let privateKeyWIF = BitcoinCash.returnPrivateKeyWIF(this.state.address1, this.props.wallet.accounts);
    if(privateKeyWIF === 'Received an invalid Bitcoin Cash address as input.') {
      this.setState({
        message1Success: '',
        message1Error: privateKeyWIF
      });
      return false;
    }
    let signature = BitcoinCash.signMessage(this.state.message1, privateKeyWIF);
    this.setState({
      signature1: signature.toString('base64')
    })
  }

  verifyMessage() {
    this.setState({
      message2Success: '',
      message2Error: ''
    })

    let address = BitcoinCash.toLegacyAddress(this.state.address2);
    let signature = this.state.signature2;
    let message = this.state.message2;
    let verified;
    let error = false;
    try {
      verified = BitcoinCash.verifyMessage(message, address, signature)
    }
    catch (e) {
      error = true;
      this.setState({
        message2Success: '',
        message2Error: e.message
      })
    }

    if(!error) {
      if(verified) {
        this.setState({
          message2Success: 'true',
          message2Error: ''
        })
      } else {
        this.setState({
          message2Error: 'Failed to verify message: Invalid signature',
          message2Success: ''
        })
      }
    }
  }

  render() {
    let success1;
    let success2;
    let error1;
    let error2;

    if(this.state.message1Success !== '') {
      success1 = <p className='success'>Valid message</p>;
    }

    if(this.state.message2Success !== '') {
      success2 = <p className='success'>Valid message</p>;
    }

    if(this.state.message1Error !== '') {
      error1 = <p className='danger'>{this.state.message1Error}</p>;
    }

    if(this.state.message2Error !== '') {
      error2 = <p className='danger'>{this.state.message2Error}</p>;
    }

    return (
      <div className="SignAndVerify">
        <h2 className="content-head is-center">Sign &amp; Verify</h2>
        <div className="pure-g">
          <div className="l-box-lrg pure-u-1-2">
            <h3>Sign Message</h3>
            <form className="pure-form pure-form-stacked">
              <label>Message</label>
              <textarea id="message1" value={this.state.message1} onChange={this.handleInputChange.bind(this)}></textarea>
              <label>Address</label>
              <input id="address1" type='text' value={this.state.address1} onChange={this.handleInputChange.bind(this)}/>
              <label>Signature</label>
              <textarea disabled id="signature1" value={this.state.signature1} onChange={this.handleInputChange.bind(this)}></textarea>
            </form>
            <button className="pure-button" onClick={this.handleClear.bind(this, 'sign')}>Clear</button>
            <button className="pure-button" onClick={this.signMessage.bind(this)}>Sign</button>
            {success1}
            {error1}
          </div>
          <div className="l-box-lrg pure-u-1-2">
            <h3>Verify Message</h3>
            <form className="pure-form pure-form-stacked">
              <label>Message</label>
              <textarea id="message2" value={this.state.message2} onChange={this.handleInputChange.bind(this)}></textarea>
              <label>Address</label>
              <input id="address2" type='text' value={this.state.address2} onChange={this.handleInputChange.bind(this)}/>
              <label>Signature</label>
              <textarea id="signature2" value={this.state.signature2} onChange={this.handleInputChange.bind(this)}></textarea>
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
