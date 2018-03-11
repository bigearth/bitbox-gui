import React, { Component } from 'react';
import moment from 'moment';
import {
  withRouter
} from 'react-router-dom';

class Block extends Component {
  render() {

    let block = this.props.block;
    let date = new Date(block.timestamp);
      // <tr className="Block" onClick={this.props.handleBlockDetails.bind(this, this.props.block.index)}>
    return (
      <tr className="Block">
        <td className='important'><span className='subheader'>HEIGHT</span> <br />{block.index}</td>
        <td><span className='subheader'>MINED ON</span> <br />{moment(date).format('MMMM Do YYYY, h:mm:ss a')}</td>
        <td><span className='subheader'>HASH</span> <br />{block.header}</td>
        <td><span className='subheader'>TX COUNT</span> <br />{block.transactions.length}</td>
      </tr>
    );
  }
}

export default withRouter(Block);
