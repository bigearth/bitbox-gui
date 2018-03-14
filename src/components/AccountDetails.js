import React, { Component } from 'react';
import BitcoinCash from '../utilities/BitcoinCash'
import {
  withRouter,
  Redirect
} from 'react-router-dom';

import Bitcoin from 'bitcoinjs-lib';
import moment from 'moment';
import underscore from 'underscore';

class AccountDetails extends Component {
  constructor(props) {
    super(props);
    this.state = {
      redirect: false
    };
  }

  handleRedirect() {
    this.setState({
      redirect: true
    })
  }
  render() {
    let account = underscore.findWhere(this.props.wallet.accounts, {index: +this.props.match.params.account_id});


    return (
      <div className="AccountDetails">
        <table className="pure-table AccountDetailsHeader">
          <tbody>
            <tr className="">
              <td className='important nextPage' onClick={this.handleRedirect.bind(this)}><i className="fa fa-arrow-left" /> <span className='subheader'>BACK</span></td>
              <td className='important'>ACCOUNT {account.index}</td>
            </tr>
          </tbody>
        </table>
      </div>
    );
  }
}

export default withRouter(AccountDetails);
