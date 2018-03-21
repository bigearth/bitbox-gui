import React, { Component } from 'react';
import {
  Route,
  Redirect
} from 'react-router-dom';

import PropTypes from 'prop-types'
import Toggle from 'react-toggle'
import Slider from 'react-rangeslider'
import 'react-rangeslider/lib/index.css'

class WalletConfiguration extends Component {
  constructor(props) {
    super(props);
    this.props.handleConfigToggle({
      target: {
        id: 'autogenerateHDMnemonic',
        checked: true
      }
    })

    this.props.handleConfigToggle({
      target: {
        id: 'newMnemonic',
        value: 0
      }
    })
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

    if(e.target.id === 'newMnemonic') {
      let val = e.target.value;
      let msg;
      if(val === '') {
        msg = val;
      } else {
        msg = bitbox.Mnemonic.validateMnemonic(val, bitbox.Mnemonic.mnemonicWordLists()[this.props.configuration.wallet.language]);
      }

      e = {
        target: {
          id: 'mnemonicValidationMsg',
          value: msg
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
    if(!this.props.configuration.wallet.autogenerateHDMnemonic) {
      customMnemonicLabel = <label>Enter the Mnemonic you wish to use</label>;
      customMnemonic = <input id='newMnemonic' type='text' placeholder="Enter mnemonic" onChange={this.handleConfigChange.bind(this)} />;
    }

    let customMnemonicMsg;
    if(!this.props.configuration.wallet.autogenerateHDMnemonic && (this.props.configuration.wallet.mnemonicValidationMsg !== 0)) {
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
                <div> <label>Exchange Currency</label>
                  <select value={this.props.configuration.wallet.exchangeCurrency} id='exchangeCurrency' onChange={this.handleConfigChange.bind(this)}>
                    <option value="USD">US Dollar</option>
                    <option value="AUD">Australian Dollar</option>
                    <option value="BRL">Brazilian Real</option>
                    <option value="CAD">Canadian Dollar</option>
                    <option value="CHF">Swiss Franc</option>
                    <option value="CLP">Chilean Peso</option>
                    <option value="CNY">Chinese Yuan</option>
                    <option value="CZK">Czech Koruna</option>
                    <option value="DKK">Danish Krone</option>
                    <option value="EUR">Euro</option>
                    <option value="GBP">British Pound</option>
                    <option value="HKD">Hong Kong Dollar</option>
                    <option value="HUF">Hungarian Forint</option>
                    <option value="IDR">Indonesian Rupiah</option>
                    <option value="ILS">Israeli Shekel</option>
                    <option value="INR">Indian rupee</option>
                    <option value="JPY">Japanese Yen</option>
                    <option value="KRW">South Korean Won</option>
                    <option value="MXN">Mexican Peso</option>
                    <option value="MYR">Malaysian Ringgit</option>
                    <option value="NOK">Norwegian Krone</option>
                    <option value="NZD">New Zealand Dollar</option>
                    <option value="PHP">Philippine Piso</option>
                    <option value="PKR">Pakistani rupee</option>
                    <option value="PLN">Polish Zloty</option>
                    <option value="RUB">Russian Ruble</option>
                    <option value="SEK">Swedish Krona</option>
                    <option value="SGD">Singapore Dollar</option>
                    <option value="THB">Thai Baht</option>
                    <option value="TRY">Turkish Lira</option>
                    <option value="TWD">Taiwan New Dollar</option>
                    <option value="ZAR">South African Rand</option>
                  </select>
                </div>
              </fieldset>
            </form>
          </div>
          <div className="l-box-lrg pure-u-1-2">
            <form className="pure-form pure-form-stacked" onSubmit={this.handleSubmit}>
              <fieldset>

                <label htmlFor='autogenerateHDMnemonic'>Autogenerate HD Mnemonic</label>
                <Toggle
                  id='autogenerateHDMnemonic'
                  defaultChecked={this.props.configuration.wallet.autogenerateHDMnemonic}
                  onChange={this.props.handleConfigToggle.bind(this)} />

                {customMnemonicLabel}
                {customMnemonic}
                {customMnemonicMsg}

                <label htmlFor='autogenerateHDPath'>Autogenerate HD Path</label>
                <Toggle
                  id='autogenerateHDPath'
                  defaultChecked={this.props.configuration.wallet.autogenerateHDPath}
                  onChange={this.props.handleConfigToggle.bind(this)} />

                {customPathLabel}
                {customPath}

                <label htmlFor='usePassword'>Use password</label>
                <Toggle
                  id='usePassword'
                  defaultChecked={this.props.configuration.wallet.usePassword}
                  onChange={this.props.handleConfigToggle.bind(this)} />

                {customPasswordLabel}
                {customPassword}

                <label htmlFor='displayCashaddr'>Display in Cashaddr format</label>
                <Toggle
                  id='displayCashaddr'
                  defaultChecked={this.props.configuration.wallet.displayCashaddr}
                  onChange={this.props.handleConfigToggle.bind(this)} />

                <label htmlFor='displayTestnet'>Display on testnet</label>
                <Toggle
                  id='displayTestnet'
                  defaultChecked={this.props.configuration.wallet.displayTestnet}
                  onChange={this.props.handleConfigToggle.bind(this)} />
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
