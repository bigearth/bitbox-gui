import React, { Component } from 'react';
import AccountsAndKeys from './AccountsAndKeys';
import {
  Route,
  Redirect
} from 'react-router-dom';

class Configuration extends Component {
  constructor(props) {
    super(props);
    this.state = {
      redirect: false
    };
  }

  resetBitbox() {
    this.setState({
      redirect: true
    })
  }

  handleTotalAccountsChange(totalAccounts) {
    this.props.handleTotalAccountsChange(totalAccounts);
  }

  handleMnemonicChange(mnemonic) {
    this.props.handleMnemonicChange(mnemonic);
  }

  handlePathChange(path) {
    this.props.handlePathChange(path);
  }

  handleEntropySliderChange(value) {
    this.props.handleEntropySliderChange(value);
  };

  handlePasswordChange(value) {
    this.props.handlePasswordChange(value);
  };

  handleConfigChange(value, id) {
    this.props.handleConfigChange(value, id);
  }

  render() {

    if (this.state.redirect) {
      this.props.resetBitbox();
      return <Redirect to='/'/>;
    }

    const AccountsAndKeysPage = (props) => {
      return (
        <AccountsAndKeys
          handleTotalAccountsChange={this.props.handleTotalAccountsChange.bind(this)}
          handleMnemonicChange={this.handleMnemonicChange.bind(this)}
          handlePathChange={this.handlePathChange.bind(this)}
          handleEntropySliderChange={this.handleEntropySliderChange.bind(this)}
          handlePasswordChange={this.handlePasswordChange.bind(this)}
          resetBitbox={this.resetBitbox.bind(this)}
          wallet={this.props.wallet}
          handleConfigChange={this.handleConfigChange.bind(this)}
        />
      );
    };

            // <li><Link to={`${this.props.match.url}/server`}>Server</Link></li>
          // <Route path={`${this.props.match.url}/server`} component={Server}/>
    return (
      <div className="Configuration">
        <div className="content">
          <Route path={`${this.props.match.url}/accounts-and-keys`} component={AccountsAndKeysPage}/>
        </div>
      </div>
    );
  }
}

export default Configuration;
