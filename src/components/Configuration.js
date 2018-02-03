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

  handleAutoGenerateMnemonicChange(autogenerateMnemonic) {
    this.props.handleAutoGenerateMnemonicChange(autogenerateMnemonic);
  }

  handleAutoGeneratePathChange(autogeneratePath) {
    this.props.handleAutoGeneratePathChange(autogeneratePath);
  }

  handleDisplayCashaddrChange(displayCashaddr) {
    this.props.handleDisplayCashaddrChange(displayCashaddr);
  }

  render() {

    if (this.state.redirect) {
      this.props.resetBitbox({});
      return <Redirect to='/'/>;
    }

    const AccountsAndKeysPage = (props) => {
      return (
        <AccountsAndKeys
          handleTotalAccountsChange={this.props.handleTotalAccountsChange.bind(this)}
          handleMnemonicChange={this.handleMnemonicChange.bind(this)}
          handlePathChange={this.handlePathChange.bind(this)}
          handleAutoGenerateMnemonicChange={this.handleAutoGenerateMnemonicChange.bind(this)}
          handleAutoGeneratePathChange={this.handleAutoGeneratePathChange.bind(this)}
          handleDisplayCashaddrChange={this.handleDisplayCashaddrChange.bind(this)}
          totalAccounts={this.props.totalAccounts}
          mnemonic={this.props.mnemonic}
          path={this.props.path}
          displayCashaddr={this.props.displayCashaddr}
          autogenerateMnemonic={this.props.autogenerateMnemonic}
          autogeneratePath={this.props.autogeneratePath}
          resetBitbox={this.resetBitbox.bind(this)}
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
