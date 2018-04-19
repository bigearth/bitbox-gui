import React, { Component } from 'react';
import BitcoinCash from '../utilities/BitcoinCash';
import QRCode from 'qrcode.react';
import FontAwesomeIcon from '@fortawesome/react-fontawesome';
import faArrowLeft from '@fortawesome/fontawesome-free-solid/faArrowLeft';

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
              <td className='important nextPage' onClick={this.handleRedirect.bind(this)}><FontAwesomeIcon icon={faArrowLeft} /> <span className='subheader'>BACK</span></td>
              <td className='important'>ADDRESS {this.props.configuration.displayCashaddr ? bitbox.Address.toCashAddress(this.state.address) : this.state.address}</td>
            </tr>
          </tbody>
        </table>
      </div>
    );
  }
}

export default Address;
