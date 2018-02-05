import React, { Component } from 'react';
import Slider from 'react-rangeslider'
import 'react-rangeslider/lib/index.css'

class AccountsAndKeys extends Component {
  constructor(props) {
    super(props)

    this.state = {
      mnemonic: props.wallet.mnemonic,
      path: props.wallet.path,
      totalAccounts: props.wallet.totalAccounts,
      autogenerateMnemonic: props.wallet.autogenerateMnemonic,
      autogeneratePath: props.wallet.autogeneratePath,
      displayCashaddr: props.wallet.displayCashaddr,
      entropy: props.wallet.entropy,
      password: props.wallet.password,
      usePassword: props.wallet.usePassword,
      displayTestnet: props.wallet.displayTestnet
    }
  }

  handleMnemonicChange(e) {
    let value = e.target.value;
    this.setState({
      mnemonic: value
    })
   this.props.handleMnemonicChange(value);
  }

  handlePathChange(e) {
    let value = e.target.value;
    this.setState({
      path: value
    })
   this.props.handlePathChange(value);
  }

  handleTotalAccountsChange(e) {
    let value = e.target.value;
    this.setState({
      totalAccounts: value
    })
   this.props.handleTotalAccountsChange(value);
  }

  handleEntropySliderChange(value) {
    this.setState({
      entropy: value
    })
   this.props.handleEntropySliderChange(value);
  };

  handlePasswordChange(e) {
    let value = e.target.value;
    this.setState({
      password: value
    })
    this.props.handlePasswordChange(value);
  }

  handleConfigChange(e) {
    let value = e.target.checked;
    let id = e.target.id;
    let obj = {};
    obj[id] = value;
    this.setState(obj)
    this.props.handleConfigChange(value, id);

    if(value && id === 'autogenerateMnemonic') {
      this.setState({
        mnemonic: ''
      })
      this.props.handleMnemonicChange('');
    } else if(value && id === 'autogeneratePath') {
      this.setState({
        path: ''
      })
      this.props.handlePathChange('');
    } else if(!value && id === 'usePassword') {
      this.setState({
        password: ''
      })
      this.props.handlePasswordChange('');
    }
  }

  render() {
        // <p id='newRobotName'>Name: <input type='text' placeholder="Robot Name" value={this.state.robotName} onChange={this.handleRobotNameChange.bind(this)} /></p>
    let customMnemonicLabel;
    let customMnemonic;
    if(!this.state.autogenerateMnemonic) {
      customMnemonicLabel = <label>Enter the Mnemonic you wish to use</label>;
      customMnemonic = <input type='text' placeholder={this.state.mnemonic} onChange={this.handleMnemonicChange.bind(this)} />;
    }

    let customPathLabel;
    let customPath;
    if(!this.state.autogeneratePath) {
      customPathLabel = <input type='text' placeholder={this.state.path} onChange={this.handlePathChange.bind(this)} />;
      customPath = <label>Enter the HD path you wish to use</label>;
    }

    let customPasswordLabel;
    let customPassword;
    if(this.state.usePassword) {
      customPasswordLabel = <input type='text' placeholder={this.state.password} onChange={this.handlePasswordChange.bind(this)} />;
      customPassword = <label>Enter the password you wish to use</label>;
    }

    let entropySlider;
    if(this.state.autogenerateMnemonic) {
      entropySlider = <div><label>Entropy</label>
        <Slider
          min={16}
          max={32}
          step={4}
          value={this.state.entropy}
          onChange={this.handleEntropySliderChange.bind(this)}
        />
        <div className='value'>{this.state.entropy} bytes/{this.state.entropy * 8} bits</div></div>;
    }

    return (
      <div className="AccountsAndKeys">
        <h2 className="content-head is-center">Accounts & Keys</h2>
        <div className="pure-g">
          <div className="l-box-lrg pure-u-1-2">
            <form className="pure-form pure-form-stacked">
              <fieldset>
                <button className="pure-button" onClick={this.props.resetBitbox.bind(this)}><i className="fas fa-redo" /> Restart</button>

                <label>Total number of accounts to generate</label>
                <input type='number' placeholder="Number of accounts" value={this.state.totalAccounts} onChange={this.handleTotalAccountsChange.bind(this)} />

                {entropySlider}
              </fieldset>
            </form>
          </div>
          <div className="l-box-lrg pure-u-1-2">
            <form className="pure-form pure-form-stacked">
              <fieldset>

                <label>Autogenerate HD Mnemonic</label>
                <input id='autogenerateMnemonic' type="checkbox" checked={this.state.autogenerateMnemonic} onChange={this.handleConfigChange.bind(this)} />
                {customMnemonicLabel}
                {customMnemonic}

                <label>Autogenerate HD Path</label>
                <input id='autogeneratePath' type="checkbox" checked={this.state.autogeneratePath} onChange={this.handleConfigChange.bind(this)} />

                {customPathLabel}
                {customPath}

                <label>Use password</label>
                <input id='usePassword' type="checkbox" checked={this.state.usePassword} onChange={this.handleConfigChange.bind(this)} />

                {customPasswordLabel}
                {customPassword}

                <label>Display in Cashaddr format</label>
                <input id='displayCashaddr' type="checkbox" checked={this.state.displayCashaddr} onChange={this.handleConfigChange.bind(this)} />

                <label>Display on testnet</label>
                <input id='displayTestnet' type="checkbox" checked={this.state.displayTestnet} onChange={this.handleConfigChange.bind(this)} />
              </fieldset>
            </form>
          </div>
        </div>
      </div>
    );
  }
}

export default AccountsAndKeys;
