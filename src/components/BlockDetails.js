import React, { Component } from 'react';
import BitcoinCash from '../utilities/BitcoinCash'
import {
  withRouter,
  Redirect
} from 'react-router-dom';

import Bitcoin from 'bitcoinjs-lib';
import moment from 'moment';
import underscore from 'underscore';

class BlockDetails extends Component {
  constructor(props) {
    super(props);
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

    // if (this.state.redirect && this.state.transaction === '') {
    //   return (<Redirect to={{
    //     pathname: `/blocks`
    //   }} />)
    // } else if (this.state.redirect && this.state.transaction) {
    //   return (<Redirect to={{
    //     pathname: `/transactions/${this.state.transaction.hash}`,
    //     state: {
    //       transaction: this.state.transaction,
    //       blockId: this.state.block.index,
    //       blockchainInstance: this.props.blockchainInstance
    //     }
    //   }} />)
    // }

    let txs = [];
    block.transactions.forEach((tx, idx) => {
      let ins = [];
      tx.inputs.forEach((inp, ind) => {
        if(this.props.configuration.displayCashaddr) {
          inp = bitbox.BitcoinCash.toCashAddress(inp.inputPubKey);
        }

        ins.push(<li key={ind}>{inp}</li>);
      })

      let outs = [];
      tx.outputs.forEach((outp, ind) => {
        if(this.props.configuration.displayCashaddr) {
          outp = bitbox.BitcoinCash.toCashAddress(outp.outputPubKey);
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
            <td>VALUE <br />{tx.value} BCH</td>
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
              <td className='important' onClick={this.handleRedirect.bind(this)}><i className="fa fa-arrow-left" /> <span className='subheader'>BACK</span></td>
              <td className='important'>BLOCK {block.index}</td>
            </tr>
          </tbody>
        </table>
        <table className="pure-table tableFormatting">
          <tbody>
            <tr>
              <td><span className='subheader'>BLOCK HASH</span> <br />{block.hash}</td>
            </tr>
            <tr>
              <td>HASHPREVBLOCK <br />00000</td>
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
