import React, { Component } from 'react';
import BitcoinCash from '../utilities/BitcoinCash'
import {
  withRouter,
  Redirect
} from 'react-router-dom';

import Bitcoin from 'bitcoinjs-lib';
import moment from 'moment';

class BlockDetails extends Component {
  constructor(props) {
    super(props);
    this.state = {
      redirect: false,
      block: props.location.state.block,
      transactions: [],
      transaction: ''
    };
  }

  componentDidMount() {

    let txs = this.state.transactions;
    this.state.block.transactions.forEach((tx, index) => {
      let t = bitbox.BitcoinCash.transaction();
      let decodedTx = t.fromHex(tx.rawHex);
      let a = bitbox.BitcoinCash.address();

      let s = bitbox.BitcoinCash.script();
      let ins = [];
      let ecpair = bitbox.BitcoinCash.ECPair();
      decodedTx.ins.forEach((input, index) => {
        let chunksIn = s.decompile(input.script);
        let inputPubKey = ecpair.fromPublicKeyBuffer(chunksIn[1], Bitcoin.networks[this.props.wallet.network]).getAddress();
        ins.push(inputPubKey);
      })

      let outs = [];
      let value = 0;
      decodedTx.outs.forEach((output, index) => {
        value += output.value;
        let outputPubKey = a.fromOutputScript(output.script, Bitcoin.networks[this.props.wallet.network]);
        outs.push(outputPubKey);
      })

      txs.push({
        hash: decodedTx.getId(),
        inputs: ins,
        outputs: outs,
        value: BitcoinCash.toBitcoinCash(value),
        timestamp: tx.timestamp,
        rawHex: tx.rawHex
      });
    })
    this.setState({
      transactions: txs
    })
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

    if (this.state.redirect && this.state.transaction === '') {
      return (<Redirect to={{
        pathname: `/blocks`
      }} />)
    } else if (this.state.redirect && this.state.transaction) {
      return (<Redirect to={{
        pathname: `/transactions/${this.state.transaction.hash}`,
        state: {
          transaction: this.state.transaction,
          blockId: this.state.block.index,
          blockchainInstance: this.props.blockchainInstance
        }
      }} />)
    }

    let txs = [];
    if(this.state.transactions.length) {
      this.state.transactions.forEach((tx, idx) => {
        let ins = [];
        tx.inputs.forEach((inp, ind) => {
          if(this.props.wallet.displayCashaddr) {
            inp = bitbox.BitcoinCash.toCashAddress(inp);
          }

          ins.push(<li key={ind}>{inp}</li>);
        })

        let outs = [];
        tx.outputs.forEach((outp, ind) => {
          if(this.props.wallet.displayCashaddr) {
            outp = bitbox.BitcoinCash.toCashAddress(outp);
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
    }

    return (
      <div className="WrapperBlockDetails">
        <table className="pure-table DetailsHeader">
          <tbody>
            <tr className="">
              <td className='important' onClick={this.handleRedirect.bind(this)}><i className="fa fa-arrow-left" /> <span className='subheader'>BACK</span></td>
              <td className='important'>BLOCK {this.state.block.index}</td>
            </tr>
          </tbody>
        </table>
        <table className="pure-table tableFormatting">
          <tbody>
            <tr>
              <td><span className='subheader'>BLOCK HASH</span> <br />{this.state.block.hash}</td>
            </tr>
            <tr>
              <td>HASHPREVBLOCK <br />00000</td>
              <td>MINED ON <br />{moment(this.state.block.timestamp).format('MMMM Do YYYY, h:mm:ss a')}</td>
              <td>TX COUNT <br />{this.state.block.transactions.length}</td>
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
