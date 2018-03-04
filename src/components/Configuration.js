import React, { Component } from 'react';
import {
  Route
} from 'react-router-dom';

import WalletConfigurationContainer from '../containers/WalletConfigurationContainer'

class Configuration extends Component {
  constructor(props) {
    super(props);
  }

  render() {

    return (
      <div className="Configuration">
        <div className="content">
          <Route path={`${this.props.match.url}/wallet`} component={WalletConfigurationContainer}/>
        </div>
      </div>
    );
  }
}

export default Configuration;
