import React, { Component } from 'react';
import BitcoinCash from '../utilities/BitcoinCash'
import {
  withRouter,
  Redirect,
  Route,
  NavLink
} from 'react-router-dom';

import {
  FormattedNumber
} from 'react-intl';

import AccountTransactionsContainer from '../containers/AccountTransactionsContainer';
import AccountSendContainer from '../containers/AccountSendContainer';
import AccountReceiveContainer from '../containers/AccountReceiveContainer';
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

    if (this.state.redirect) {
      return (<Redirect to={{
        pathname: `/`
      }} />)
    }

    return (
      <div className="AccountDetails">
        <table className="pure-table">
          <tbody>
            <tr className="">
              <td className='important nextPage' onClick={this.handleRedirect.bind(this)}><i className="fa fa-arrow-left" /> <span className='subheader'>BACK</span></td>
              <td className='important'>ACCOUNT {account.index}</td>
              <td className='important'>
                <NavLink
                  to={`/accounts/${account.index}/transactions`}>
                  <button className='pure-button pure-button-primary'>
                    <i className="fas fa-qrcode" /> TRANSACTIONS
                  </button>
                </NavLink>
              </td>
              <td className='important'>
                <NavLink
                  to={`/accounts/${account.index}/receive`}>
                  <button className='pure-button pure-button-primary'>
                    <i className="fas fa-qrcode" /> RECEIVE
                  </button>
                </NavLink>
              </td>
              <td className='important'>
                <NavLink
                  to={`/accounts/${account.index}/send`}>
                  <button className='pure-button pure-button-primary'>
                    <i className="far fa-check-circle"></i> SEND
                  </button>
                </NavLink>
              </td>
            </tr>
          </tbody>
        </table>
        <div className="pure-g AccountDetailsHeader">
          <div className="pure-u-1-4">
            <p className='subheader'>Balance</p>
            <p className='balance'><FormattedNumber value={507.4200000 * this.props.configuration.exchangeRate} style="currency" currency={this.props.configuration.exchangeCurrency} /></p>
            <p className='subbalance'>507.4200000 BCH</p>

          </div>
          <div className="pure-u-1-4">
            <p className='subheader'>Rate</p>
            <p className='balance'>${this.props.configuration.exchangeRate}</p>
            <p className='subbalance'>1 BCH</p>
          </div>
          <div className="pure-u-1-4">
            <p className='subheader'>Received</p>
            <p className='balance'><span className="plus">+</span> <FormattedNumber value={20 * this.props.configuration.exchangeRate} style="currency" currency={this.props.configuration.exchangeCurrency} /></p>
            <p className='subbalance'>20 BCH</p>
          </div>
          <div className="pure-u-1-4">
            <p className='subheader'>Sent</p>
            <p className='balance'><span className="minus">-</span> <FormattedNumber value={20 * this.props.configuration.exchangeRate} style="currency" currency={this.props.configuration.exchangeCurrency} /></p>
            <p className='subbalance'>20 BCH</p>
          </div>
        </div>
        <Route path="/accounts/:account_id/transactions" component={AccountTransactionsContainer}/>
        <Route path="/accounts/:account_id/receive" component={AccountReceiveContainer}/>
        <Route path="/accounts/:account_id/send" component={AccountSendContainer}/>
      </div>
    );
  }
}

export default withRouter(AccountDetails);
