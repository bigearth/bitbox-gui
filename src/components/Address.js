import React, { Component } from 'react';
import BitcoinCash from '../utilities/BitcoinCash';
import QRCode from 'qrcode.react';

class Address extends Component {
  constructor(props) {
    super(props);
    this.state = {
      address: this.props.match.params.address_id,
      redirect: false
    }
  }

  handleRedirect() {
    this.setState({
      redirect: true
    })
  }

  render() {
    if(this.state.redirect) {
      this.props.history.goBack()
    }
    return (
      <div className="Address">
        <table className="pure-table DetailsHeader">
          <tbody>
            <tr className="">
              <td className='important nextPage' onClick={this.handleRedirect.bind(this)}><i className="fa fa-arrow-left" /> <span className='subheader'>BACK</span></td>
              <td className='important'>ADDRESS {this.props.configuration.displayCashaddr ? bitbox.Address.toCashAddress(this.state.address) : this.state.address}</td>
            </tr>
          </tbody>
        </table>
      </div>
    );
  }
}

export default Address;
