import React, { Component } from 'react';
import {
  Redirect
} from 'react-router-dom';

class Account extends Component {
  constructor(props) {
    super(props);
    this.state = {
    }
  }

  handleRedirect(e) {
    if(e.target.nodeName === 'BUTTON' || e.target.nodeName === 'path') {
      this.props.showAccountModal(this.props.account)
    } else {
    this.setState({
      redirect: true
    });
    }
  }

  render() {
    let address;

    if(this.props.displayCashaddr) {
      address = <span>{this.props.account.cashAddr}</span>;
    } else {
      address = <span>{this.props.account.legacy}</span>;
    }

    let coinbase;
    if(this.props.account.index === 0) {
      coinbase = <span> <i className="fas fa-asterisk" /> Coinbase</span>
    }

    let index = this.props.account.index;

    if(this.state.redirect) {
      return (<Redirect to={{
        pathname: `/accounts/${index}/transactions`
      }} />)
    }

    return (
      <tr className="Account" onClick={this.handleRedirect.bind(this)}>
        <td className='important'><span className='subheader'>ADDRESS{coinbase}</span> <br />{address}</td>
        <td className='important'><span className='subheader'>BALANCE</span> <br />0 BCH</td>
        <td><span className='subheader'>TX COUNT</span> <br />0</td>
        <td><span className='subheader'>INDEX</span> <br />{index}</td>
        <td><button className="pure-button openModal"><i className="fas fa-key openModal" /></button></td>
      </tr>
    );
  }
}

export default Account;
