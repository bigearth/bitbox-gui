import React, { Component } from 'react';
import moment from 'moment';
import {
  withRouter
} from 'react-router-dom';

import Block from '../models/Block';
import Transaction from '../models/Transaction';
import Output from '../models/Output';
import Input from '../models/Input';
import Miner from '../utilities/Miner';
import underscore from 'underscore';

class StatusBar extends Component {

  createBlock() {
    Miner.createCoinbaseTx();
    Miner.mineBlock();
  }

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
          <li className="pure-menu-item">
            <button className='pure-button danger-background' onClick={this.createBlock.bind(this)}><i className="fas fa-cube"></i> Create block</button>
          </li>
        </ul>
      </div>
    );
  }
}

export default withRouter(StatusBar);
