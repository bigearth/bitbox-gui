import React, { Component } from 'react';
import {
  withRouter,
  Redirect
} from 'react-router-dom';

import moment from 'moment';

class BlockDetails extends Component {
  constructor(props) {
    super(props);
    this.state = {
      blockId: 0,
      redirect: false
    };
  }

  handleRedirect(blockId) {
    this.setState({
      redirect: true
    })
  }

  render() {

    if (this.state.redirect) {
      return <Redirect
        push
        to={{
          pathname: `/blocks`
        }}
      />
    }

    let block;
    if(this.props.blockchainInstance && this.props.blockchainInstance.chain.length) {
      block = this.props.blockchainInstance.chain[this.props.match.params.block_id];
    }
    return (
      <div className="WrapperBlockDetails">
        <table className="pure-table HeaderBlockDetails">
          <tbody>
            <tr className="">
              <td className='important' onClick={this.handleRedirect.bind(this)}><i className="fa fa-arrow-left" /> <span className='subheader'>BACK</span></td>
              <td className='important'>BLOCK {block.index}</td>
            </tr>
          </tbody>
        </table>
        <table className="pure-table BodyBlockDetails">
          <tbody>
            <tr className="">
              <td><span className='subheader'>BLOCK HASH</span> <br />{block.blockheader.hashMerkleRoot}</td>
            </tr>
            <tr className="BodyBlockDetails">
              <td>HASHPREVBLOCK <br />{block.blockheader.hashPrevBlock}</td>
              <td>MINED ON <br />{moment(block.blockheader.time).format('MMMM Do YYYY, h:mm:ss a')}</td>
              <td>TX COUNT <br />{block.transactions.length}</td>
              <td>DIFFICULTY <br />{block.blockheader.bits}</td>
              <td>NONCE <br />{block.blockheader.nonce}</td>
            </tr>
          </tbody>
        </table>
      </div>
    );
  }
}

export default withRouter(BlockDetails);
