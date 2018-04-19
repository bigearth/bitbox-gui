import React, { Component } from 'react';
import {
  withRouter,
  Redirect
} from 'react-router-dom';
import BitcoinCash from '../utilities/BitcoinCash'
import Bitcoin from 'bitcoinjs-lib';
import moment from 'moment';
import underscore from 'underscore';
import FontAwesomeIcon from '@fortawesome/react-fontawesome';
import faArrowLeft from '@fortawesome/fontawesome-free-solid/faArrowLeft';

import '../styles/transaction.scss';

class Transaction extends Component {
  constructor(props) {
    super(props);
    this.state = {
      redirect: false
    }
  }

  handleRedirect() {
    this.setState({
      redirect: true
    })
  }

  render() {
    let block = underscore.findWhere(this.props.blockchain.chain, {index: +this.props.match.params.block_id});
    let tx = underscore.findWhere(block.transactions, {txid: this.props.match.params.transaction_id});

    if (this.state.redirect) {
      return <Redirect
        push
        to={{
          pathname: `/blocks/${this.props.match.params.block_id}`
        }}
      />
    }

    let inputs = [];
    tx.inputs.forEach((input, index) => {
      // if(this.props.configuration.wallet.displayCashaddr) {
      //   input.inputPubKey = bitbox.Address.toCashAddress(input.inputPubKey);
      // }
      // inputs.push(
      //   <table className="pure-table tableFormatting" key={index}>
      //     <tbody>
      //       <tr>
      //         <td>{input.inputPubKey}</td>
      //       </tr>
      //       <tr>
      //         <td className='breakWord'>HEX<br /> {input.hex}</td>
      //       </tr>
      //       <tr>
      //         <td className='breakWord'>REDEEM SCRIPT<br /> {input.script}</td>
      //       </tr>
      //     </tbody>
      //   </table>
      // );
    });

    let outputs = [];
    tx.outputs.forEach((output, index) => {
      if(!this.props.configuration.wallet.displayCashaddr) {
        output.scriptPubKey.addresses[0] = bitbox.Address.toLegacyAddress(output.scriptPubKey.addresses[0]);
      }
      outputs.push(
        <table className="pure-table tableFormatting" key={index}>
          <tbody>
            <tr>
              <td>{output.scriptPubKey.addresses[0]}</td>
            </tr>
            <tr>
              <td className='breakWord'>LOCK SCRIPT<br /> {output.scriptPubKey.asm}</td>
            </tr>
            <tr>
              <td className='breakWord'>VALUE<br /> {bitbox.BitcoinCash.toBitcoinCash(output.value)} BCH</td>
            </tr>
          </tbody>
        </table>
      );
    });

    return (
      <div className="WrapperBlockDetails Transaction">
        <table className="pure-table DetailsHeader">
          <tbody>
            <tr className="">
              <td className='important nextPage' onClick={this.handleRedirect.bind(this)}><FontAwesomeIcon icon={faArrowLeft} /> <span className='subheader'>BACK</span></td>
              <td className='important'>TRANSACTION {tx.hash}</td>
            </tr>
          </tbody>
        </table>
        <table className="pure-table tableFormatting">
          <tbody>
            <tr>
              <td colSpan="4" className='breakWord'><span className='subheader'>HEX</span> <br />{tx.rawHex}</td>
              <td className="label coinbase">COINBASE</td>
            </tr>
            <tr>
              <td>VALUE <br />{bitbox.BitcoinCash.toBitcoinCash(tx.value)} BCH</td>
              <td>DATE <br />{moment(tx.timestamp).format('MMMM Do YYYY, h:mm:ss a')}</td>
            </tr>
          </tbody>
        </table>
        <div className="pure-g transactionDetails">
          <div className="pure-u-1-2">
            <h3>Inputs</h3>
            {inputs}
          </div>
          <div className="pure-u-1-2">
            <h3>Outputs</h3>
            {outputs}
          </div>
        </div>
      </div>
    );
  }
}

export default withRouter(Transaction);
