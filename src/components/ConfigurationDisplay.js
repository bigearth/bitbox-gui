import React, { Component } from 'react';
import {
  Route,
  Redirect
} from 'react-router-dom';

import WalletConfigurationContainer from '../containers/WalletConfigurationContainer'

class ConfigurationDisplay extends Component {
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

  render() {

    if (this.state.redirect) {
      this.props.resetBitbox();
      return <Redirect to='/'/>;
    }

            // <li><Link to={`${this.props.match.url}/server`}>Server</Link></li>
          // <Route path={`${this.props.match.url}/server`} component={Server}/>
    return (
      <div className="ConfigurationDisplay">
        <div className="content">
          <Route path={`${this.props.match.url}/accounts-and-keys`} component={WalletConfigurationContainer}/>
        </div>
      </div>
    );
  }
}

export default ConfigurationDisplay;
