import React, { Component } from 'react';
import {
  Redirect
} from 'react-router-dom';

import underscore from 'underscore';
import QRCode from 'qrcode.react';

class AccountReceive extends Component {
  constructor(props) {
    super(props);
    this.state = {
      freshAddressIndex: 0,
      activeAddress: '',
      redirect: false
    }
  }

  componentDidMount() {
    let account = underscore.findWhere(this.props.wallet.accounts, {index: +this.props.match.params.account_id});
    let addy = account.addresses.getChainAddress(0);

    this.setState({
      activeAddress: addy
    })
  }

  handleRedirect(e) {
    this.setState({
      activeAddress: e.target.id,
      redirect: true
    })
  }

  moreAddresses(account) {
    let newIndex = this.state.freshAddressIndex + 1;
    this.setState({
      freshAddressIndex: newIndex
    })
  }

  render() {
    if(this.state.redirect) {
      return (<Redirect to={{
        pathname: `/addresses/${this.state.activeAddress}`
      }} />)
    }

    let freshAddresses = [];
    let previousAddresses = [];

    let account = underscore.findWhere(this.props.wallet.accounts, {index: +this.props.match.params.account_id});
    let addy = account.addresses.getChainAddress(0);
    let addressHeight = account.addresses.chains[0].find(addy)

    let hdNode = bitbox.HDNode.fromXPub(account.xpub)
    for (let i = addressHeight; i <= (addressHeight + this.state.freshAddressIndex); i++) {
      let child = hdNode.derivePath(`0/${i}`)
      let address = bitbox.HDNode.getLegacyAddress(child);
      freshAddresses.push(<li id={address} key={i} onClick={this.handleRedirect.bind(this)}>
        /{i} {this.props.configuration.displayCashaddr ? bitbox.Address.toCashAddress(address) : address}
      </li>);
    }

    for (let i = 0; i < addressHeight; i++) {
      let address = account.addresses.chains[0].addresses[i];
      previousAddresses.push(<li id={address} key={i} onClick={this.handleRedirect.bind(this)}>
        /{i} {this.props.configuration.displayCashaddr ? bitbox.Address.toCashAddress(address) : address}<br />
        <span className='totalReceived'>Total received: 0 BCH</span>
      </li>);
    }

    return (
      <div className="AccountReceive content pure-g">
        <div className="pure-u-1-2">
          <h2><i className="fas fa-qrcode" /> Receive Bitcoin Cash</h2>
          <h3><i className="far fa-clock" /> Fresh Addresses</h3>
          <ul>
            {freshAddresses}
          </ul>
          <button className='pure-button pure-button-primary' onClick={this.moreAddresses.bind(this, account)}>More Addresses</button>

          <h3><i className="fas fa-clock" /> Previous Addresses</h3>
          <ul>
            {previousAddresses}
          </ul>
        </div>
        <div className="pure-u-1-2 qr">
          <p><QRCode value={this.props.configuration.displayCashaddr ? bitbox.Address.toCashAddress(addy) : addy} /></p>
          <p><code>m / 44&rsquo; / 145&rsquo; / {account.index}&rsquo; / 0 / {previousAddresses.length}</code></p>
        </div>
      </div>
    );
  }
}

export default AccountReceive;
