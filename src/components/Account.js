import React, { Component } from 'react';
import {
  Redirect
} from 'react-router-dom';
import '../styles/account.scss';

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
      address = <span>{bitbox.Address.toCashAddress(this.props.account.addresses.getChainAddress(0))}</span>;
    } else {
      address = <span>{bitbox.Address.toLegacyAddress(this.props.account.addresses.getChainAddress(0))}</span>;
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

    let HDPath = `m/${this.props.configuration.HDPath.purpose}/${this.props.configuration.HDPath.coinCode}`;
    let addressHeight = this.props.account.addresses.chains[0].find(this.props.account.addresses.getChainAddress(0))
    return (
      <tr className="Account" onClick={this.handleRedirect.bind(this)}>
        <td className='important'><span className='subheader'>ADDRESS{coinbase}</span> <br />{address} <br /><span className='hdPath'>{HDPath}/{index}&rsquo;/0/{addressHeight}</span></td>
        <td className='important'><span className='subheader'>BALANCE</span> <br />{bitbox.BitcoinCash.toBitcoinCash(this.props.account.balance)} BCH</td>
        <td><span className='subheader'>TX COUNT</span> <br />{this.props.account.txCount}</td>
        <td><span className='subheader'>ACCOUNT</span> <br />{index}</td>
        <td><button className="pure-button openModal"><i className="fas fa-key openModal" /></button></td>
      </tr>
    );
  }
}

export default Account;
