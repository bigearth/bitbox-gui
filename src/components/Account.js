import React, { Component } from 'react';

class Account extends Component {
  constructor(props) {
    super(props);
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

    return (
      <tr className="Account">
        <td className='important'><span className='subheader'>ADDRESS{coinbase}</span> <br />{address}</td>
        <td className='important'><span className='subheader'>BALANCE</span> <br />0 BCH</td>
        <td><span className='subheader'>TX COUNT</span> <br />0</td>
        <td><span className='subheader'>INDEX</span> <br />{index}</td>
        <td><button className="pure-button" onClick={this.props.showAccountModal.bind(this, this.props.account)}><i className="fas fa-key" /></button></td>
      </tr>
    );
  }
}

export default Account;
