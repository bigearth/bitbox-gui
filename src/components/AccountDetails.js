import React, { Component } from 'react';
import BitcoinCash from '../utilities/BitcoinCash'
import {
  withRouter,
  Redirect,
  Route,
  NavLink
} from 'react-router-dom';

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
        <table className="pure-table AccountDetailsHeader">
          <tbody>
            <tr className="">
              <td className='important nextPage' onClick={this.handleRedirect.bind(this)}><i className="fa fa-arrow-left" /> <span className='subheader'>BACK</span></td>
              <td className='important'>ACCOUNT {account.index}</td>
            </tr>
          </tbody>
        </table>
        <table className="pure-table tableFormatting">
          <tbody>
            <tr>
              <td><span className='subheader'>BALANCE</span> <br /></td>
            </tr>
            <tr>
              <td>RECEIVED <br /></td>
              <td>SENT <br /></td>
              <td>
                <NavLink
                  to={`/accounts/${account.index}/receive`}>
                  <i className="far fa-check-circle"></i> RECEIVE
                </NavLink>
              <br /></td>
              <td>
                <NavLink
                  to={`/accounts/${account.index}/send`}>
                  <i className="far fa-check-circle"></i> SEND
                </NavLink>
              <br /></td>
            </tr>
          </tbody>
        </table>
        <Route path="/accounts/:account_id/transactions" component={AccountTransactionsContainer}/>
        <Route path="/accounts/:account_id/send" component={AccountSendContainer}/>
        <Route path="/accounts/:account_id/receive" component={AccountReceiveContainer}/>
      </div>
    );
  }
}

export default withRouter(AccountDetails);
