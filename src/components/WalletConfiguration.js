import React, { Component } from 'react';
import {
  Route,
  Redirect
} from 'react-router-dom';

import PropTypes from 'prop-types'
import Slider from 'react-rangeslider'
import 'react-rangeslider/lib/index.css'

class WalletConfiguration extends Component {
  constructor(props) {
    super(props);
    this.state = {
      redirect: false
    };
  }

  resetBitbox(configuration) {
    this.props.resetBitbox(configuration);
    this.setState({
      redirect: true
    })
  }

  handleSubmit(event) {
    event.preventDefault();
  }

  handleConfigChange(e) {
    this.props.handleConfigChange(e);
    if(e.target.id === 'mnemonic' || e.target.id === 'language') {
      let val;
      if(e.target.id === 'mnemonic') {
        val = e.target.value;
      } else {
        val = this.props.configuration.wallet.mnemonic;
      }

      e = {
        target: {
          id: 'mnemonicValidationMsg',
          value: bitbox.BitcoinCash.Mnemonic.validateMnemonic(val, bitbox.BitcoinCash.Mnemonic.mnemonicWordLists()[this.props.configuration.wallet.language])
        }
      }
      this.props.handleConfigChange(e);
    }
  }

  render() {
    if (this.state.redirect) {
      return <Redirect to='/'/>;
    }

    let customMnemonicLabel;
    let customMnemonic;
    let customMnemonicMsg;
    if(!this.props.configuration.wallet.autogenerateHDMnemonic) {
      customMnemonicLabel = <label>Enter the Mnemonic you wish to use</label>;
      customMnemonic = <input id='mnemonic' type='text' placeholder={this.props.configuration.wallet.mnemonic} onChange={this.handleConfigChange.bind(this)} />;
      customMnemonicMsg = <p>{this.props.configuration.wallet.mnemonicValidationMsg}</p>;
    }

    let restartBtn;
    if(!this.props.configuration.wallet.autogenerateHDMnemonic && this.props.configuration.wallet.mnemonicValidationMsg !== 'Valid mnemonic') {
      restartBtn = <button disabled className="pure-button"><i className="fas fa-redo" /> Restart</button>
    } else {
      restartBtn = <button className="pure-button" onClick={this.resetBitbox.bind(this, this.props.configuration.wallet)}><i className="fas fa-redo" /> Restart</button>
    }

    let customPathLabel;
    let customPath;
    if(!this.props.configuration.wallet.autogenerateHDPath) {
      customPathLabel = <label>Enter the HD path you wish to use</label>;
      customPath = <input id='HDPath' type='text' placeholder={`${this.props.configuration.wallet.HDPath.masterKey}/${this.props.configuration.wallet.HDPath.purpose}/${this.props.configuration.wallet.HDPath.coinCode}`} onChange={this.handleConfigChange.bind(this)} />;
    }

    let customPasswordLabel;
    let customPassword;
    if(this.props.configuration.wallet.usePassword) {
      customPasswordLabel = <input id='password' type='text' placeholder={this.props.configuration.wallet.password} onChange={this.handleConfigChange.bind(this)} />;
      customPassword = <label>Enter the password you wish to use</label>;
    }

    let entropySlider;
    if(this.props.configuration.wallet.autogenerateHDMnemonic) {
      entropySlider = <div><label>Entropy</label>
        <Slider
          min={16}
          max={32}
          step={4}
          value={this.props.configuration.wallet.entropy}
          onChange={this.props.handleEntropySliderChange.bind(this)}
        />
        <div className='value'>{this.props.configuration.wallet.entropy} bytes/{this.props.configuration.wallet.entropy * 8} bits</div></div>;
    }

    return (
      <div className="AccountsAndKeys">
        <h2 className="content-head is-center">Accounts & Keys</h2>
        <div className="pure-g">
          <div className="l-box-lrg pure-u-1-2">
            <form className="pure-form pure-form-stacked" onSubmit={this.handleSubmit}>
              <fieldset>
                {restartBtn}

                <label>Total number of accounts to generate</label>
                <input id='totalAccounts' type='number' placeholder="Number of accounts" value={this.props.configuration.wallet.totalAccounts} onChange={this.handleConfigChange.bind(this)} />
                {entropySlider}
                <div> <label>Mnemonic Language</label>
                  <select value={this.props.configuration.wallet.language} id='language' onChange={this.handleConfigChange.bind(this)}>
                    <option value="english">English</option>
                    <option value="chinese_simplified">Chinese simplified</option>
                    <option value="chinese_traditional">Chinese traditional</option>
                    <option value="french">French</option>
                    <option value="italian">Italian</option>
                    <option value="japanese">Japanese</option>
                    <option value="korean">Korean</option>
                    <option value="spanish">Spanish</option>
                  </select>
                </div>
              </fieldset>
            </form>
          </div>
          <div className="l-box-lrg pure-u-1-2">
            <form className="pure-form pure-form-stacked" onSubmit={this.handleSubmit}>
              <fieldset>

                <label>Autogenerate HD Mnemonic</label>
                <input id='autogenerateHDMnemonic' type="checkbox" checked={this.props.configuration.wallet.autogenerateHDMnemonic} onChange={this.props.handleConfigToggle.bind(this)} />
                {customMnemonicLabel}
                {customMnemonic}
                {customMnemonicMsg}

                <label>Autogenerate HD Path</label>
                <input id='autogenerateHDPath' type="checkbox" checked={this.props.configuration.wallet.autogenerateHDPath} onChange={this.props.handleConfigToggle.bind(this)} />

                {customPathLabel}
                {customPath}

                <label>Use password</label>
                <input id='usePassword' type="checkbox" checked={this.props.configuration.wallet.usePassword} onChange={this.props.handleConfigToggle.bind(this)} />

                {customPasswordLabel}
                {customPassword}

                <label>Display in Cashaddr format</label>
                <input id='displayCashaddr' type="checkbox" checked={this.props.configuration.wallet.displayCashaddr} onChange={this.props.handleConfigToggle.bind(this)} />

                <label>Display on testnet</label>
                <input id='displayTestnet' type="checkbox" checked={this.props.configuration.wallet.displayTestnet} onChange={this.props.handleConfigToggle.bind(this)} />
              </fieldset>
            </form>
          </div>
        </div>
      </div>
    );
  }
}

export default WalletConfiguration;
 
WalletConfiguration.propTypes = {
  wallet: PropTypes.object
}
