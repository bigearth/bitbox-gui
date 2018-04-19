import React, { Component } from 'react';
import BitcoinCash from '../utilities/BitcoinCash'
import {
  withRouter,
  Redirect
} from 'react-router-dom';

import Bitcoin from 'bitcoinjs-lib';
import moment from 'moment';
import underscore from 'underscore';
import FontAwesomeIcon from '@fortawesome/react-fontawesome';
import faArrowLeft from '@fortawesome/fontawesome-free-solid/faArrowLeft';

class BlockDetails extends Component {
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

  handlexTransactionDetails(transaction) {
    this.setState({
      transaction: transaction,
      redirect: true
    })
  }

  render() {
    let block = underscore.findWhere(this.props.blockchain.chain, {index: +this.props.match.params.block_id});

    if (this.state.redirect && this.state.transaction) {
      return (<Redirect to={{
        pathname: `/blocks/${this.props.match.params.block_id}/transactions/${this.state.transaction.txid}`
      }} />)
    } else if (this.state.redirect) {
      return (<Redirect to={{
        pathname: `/blocks`
      }} />)
    }

    let txs = [];
    block.transactions.forEach((tx, idx) => {
      let ins = [];
      tx.inputs.forEach((inp, ind) => {
        // if(this.props.configuration.displayCashaddr) {
        //   inp = bitbox.Address.toCashAddress(inp.inputPubKey);
        // } else {
        //   inp = inp.inputPubKey;
        // }
    //
    //     ins.push(<li key={ind}>{inp}</li>);
      })

      let outs = [];
      tx.outputs.forEach((outp, ind) => {
        if(this.props.configuration.displayCashaddr) {
          outp = bitbox.Address.toCashAddress(outp.scriptPubKey.addresses[0]);
        } else {
          outp = outp.scriptPubKey.addresses[0];
        }
        outs.push(<li key={ind}>{outp}</li>);
      })

      txs.push(
        <tbody key={idx} className="txSummary" onClick={this.handlexTransactionDetails.bind(this, tx)}>
          <tr className="tableFormatting">
            <td><span className='subheader'>TX HASH</span> <br />{tx.hash}</td>
            <td></td>
            <td></td>
            <td className="label coinbase">COINBASE</td>
          </tr>
          <tr>
            <td>INPUTS <br /><ul>{ins}</ul></td>
            <td>OUTPUTS <br /><ul>{outs}</ul></td>
            <td>VALUE <br />{bitbox.BitcoinCash.toBitcoinCash(tx.value)} BCH</td>
            <td>DATE <br />{moment(tx.timestamp).format('MMMM Do YYYY, h:mm:ss a')}</td>
          </tr>
        </tbody>
      );
    });

    return (
      <div className="WrapperBlockDetails">
        <table className="pure-table DetailsHeader">
          <tbody>
            <tr className="">
              <td className='important nextPage' onClick={this.handleRedirect.bind(this)}><FontAwesomeIcon icon={faArrowLeft} /> <span className='subheader'>BACK</span></td>
              <td className='important'>BLOCK {block.index}</td>
            </tr>
          </tbody>
        </table>
        <table className="pure-table tableFormatting">
          <tbody>
            <tr>
              <td><span className='subheader'>BLOCK HASH</span> <br />{block.header}</td>
            </tr>
            <tr>
              <td>HASHPREVBLOCK <br />{block.previousBlockHeader}</td>
              <td>MINED ON <br />{moment(block.timestamp).format('MMMM Do YYYY, h:mm:ss a')}</td>
              <td>TX COUNT <br />{block.transactions.length}</td>
              <td>DIFFICULTY <br />0</td>
              <td>NONCE <br />0</td>
            </tr>
          </tbody>
        </table>
        <table className="pure-table tableFormatting nextPage">
          {txs}
        </table>
      </div>
    );
  }
}

export default withRouter(BlockDetails);
