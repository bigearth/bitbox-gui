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

  handleEntropySliderChange(value) {
    this.props.handleEntropySliderChange(value);
  };

  handleConfigChange(value, id) {
    this.props.handleConfigChange(value, id);
  }

  handleConfigToggle(value, id) {
    this.props.handleConfigToggle(value, id);
  }

  render() {

    if (this.state.redirect) {
      this.props.resetBitbox();
      return <Redirect to='/'/>;
    }

    const AccountsAndKeysPage = (props) => {
      return (
        <AccountsAndKeys
          handleEntropySliderChange={this.handleEntropySliderChange.bind(this)}
          resetBitbox={this.resetBitbox.bind(this)}
          wallet={this.props.wallet}
          handleConfigChange={this.handleConfigChange.bind(this)}
          handleConfigToggle={this.handleConfigToggle.bind(this)}
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
