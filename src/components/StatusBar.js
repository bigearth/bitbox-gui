import React, { Component } from 'react';
import moment from 'moment';
import {
  withRouter
} from 'react-router-dom';

class StatusBar extends Component {
  render() {
    return (
      <div className="pure-menu pure-menu-horizontal networkInfo">
        <ul className="pure-menu-list">
          <li className="pure-menu-item">
            CURRENT BLOCK <br />
            {this.props.blockchain.chain.length}
          </li>
          <li className="pure-menu-item">
            RPC SERVER <br /> http://127.0.0.1:8332
          </li>
          <li className="pure-menu-item">
            MINING STATUS <br /> AUTOMINING <i className="fas fa-spinner fa-spin" />
          </li>
        </ul>
      </div>
    );
  }
}

export default withRouter(StatusBar);
