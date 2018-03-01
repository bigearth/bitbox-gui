import React, { Component } from 'react';
import PropTypes from 'prop-types'
import Slider from 'react-rangeslider'
import 'react-rangeslider/lib/index.css'

class WalletConfiguration extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  handleEntropySliderChange() {
  }
  render() {
    // <button className="pure-button" onClick={this.props.resetBitbox.bind(this)}><i className="fas fa-redo" /> Restart</button>
    let customMnemonicLabel;
    let customMnemonic;
    if(!this.props.config.wallet.autogenerateHDMnemonic) {
      customMnemonicLabel = <label>Enter the Mnemonic you wish to use</label>;
      customMnemonic = <input id='mnemonic' type='text' placeholder={this.props.config.wallet.mnemonic} onChange={this.props.handleConfigChange.bind(this)} />;
    }

    let customPathLabel;
    let customPath;
    if(!this.props.config.wallet.autogenerateHDPath) {
      customPathLabel = <label>Enter the HD path you wish to use</label>;
      customPath = <input id='path' type='text' placeholder={this.props.config.wallet.path} onChange={this.props.handleConfigChange.bind(this)} />;
    }

    let customPasswordLabel;
    let customPassword;
    if(this.props.config.wallet.usePassword) {
      customPasswordLabel = <input id='password' type='text' placeholder={this.props.config.wallet.password} onChange={this.props.handleConfigChange.bind(this)} />;
      customPassword = <label>Enter the password you wish to use</label>;
    }

    let entropySlider;
    if(this.props.config.wallet.autogenerateHDMnemonic) {
      entropySlider = <div><label>Entropy</label>
        <Slider
          min={16}
          max={32}
          step={4}
          value={this.props.config.wallet.entropy}
          onChange={this.handleEntropySliderChange.bind(this)}
        />
        <div className='value'>{this.props.config.wallet.entropy} bytes/{this.props.config.wallet.entropy * 8} bits</div></div>;
    }
    return (
      <div className="AccountsAndKeys">
        <h2 className="content-head is-center">Accounts & Keys</h2>
        <div className="pure-g">
          <div className="l-box-lrg pure-u-1-2">
            <form className="pure-form pure-form-stacked">
              <fieldset>

                <label>Total number of accounts to generate</label>
                <input id='totalAccounts' type='number' placeholder="Number of accounts" value={this.props.config.wallet.totalAccounts} onChange={this.props.handleConfigChange.bind(this)} />

                {entropySlider}
              </fieldset>
            </form>
          </div>
          <div className="l-box-lrg pure-u-1-2">
            <form className="pure-form pure-form-stacked">
              <fieldset>

                <label>Autogenerate HD Mnemonic</label>
                <input id='autogenerateHDMnemonic' type="checkbox" checked={this.props.config.wallet.autogenerateHDMnemonic} onChange={this.props.handleConfigToggle.bind(this)} />
                {customMnemonicLabel}
                {customMnemonic}

                <label>Autogenerate HD Path</label>
                <input id='autogenerateHDPath' type="checkbox" checked={this.props.config.wallet.autogenerateHDPath} onChange={this.props.handleConfigToggle.bind(this)} />

                {customPathLabel}
                {customPath}

                <label>Use password</label>
                <input id='usePassword' type="checkbox" checked={this.props.config.wallet.usePassword} onChange={this.props.handleConfigToggle.bind(this)} />

                {customPasswordLabel}
                {customPassword}

                <label>Display in Cashaddr format</label>
                <input id='displayCashaddr' type="checkbox" checked={this.props.config.wallet.displayCashaddr} onChange={this.props.handleConfigToggle.bind(this)} />

                <label>Display on testnet</label>
                <input id='displayTestnet' type="checkbox" checked={this.props.config.wallet.displayTestnet} onChange={this.props.handleConfigToggle.bind(this)} />
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
