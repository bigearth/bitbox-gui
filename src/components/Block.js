import React, { Component } from 'react';
import moment from 'moment';
import {
  Redirect,
  withRouter
} from 'react-router-dom';

class Block extends Component {
  constructor(props) {
    super(props);
    this.state = {
      redirect: false
    }
  }

  handleRedirect() {
    this.setState({
      redirect: true
    });
  }

  render() {
    let block = this.props.block;
    let date = new Date(block.timestamp);

    if(this.state.redirect) {
      return (<Redirect to={{
        pathname: `/blocks/${block.index}`
      }} />)
    }
    
    return (
      <tr className="Block" onClick={this.handleRedirect.bind(this)}>
        <td className='important'><span className='subheader'>HEIGHT</span> <br />{block.index}</td>
        <td><span className='subheader'>MINED ON</span> <br />{moment(date).format('MMMM Do YYYY, h:mm:ss a')}</td>
        <td><span className='subheader'>HASH</span> <br />{block.header}</td>
        <td><span className='subheader'>TX COUNT</span> <br />{block.transactions.length}</td>
      </tr>
    );
  }
}

export default withRouter(Block);
