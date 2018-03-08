import React, { Component } from 'react';
import BlocksDetails from './BlocksDetails';
import underscore from 'underscore';
import {
  Redirect
} from 'react-router-dom';

class Blocks extends Component {
  constructor(props) {
    super(props);
    this.state = {
      redirect: false,
      blockId: 0
    };
  }

  render() {

    if (this.state.redirect) {
      return (<Redirect to={{
        pathname: `${this.props.match.url}/${this.state.blockId}`,
        state: {
          block: this.props.blockchainInstance.chain[this.state.blockId]
        }
      }} />)
    }

    let blocks = [];
    if(this.props.blockchainInstance && this.props.blockchainInstance.chain.length) {
      let chain = underscore.sortBy(this.props.blockchainInstance.chain, 'index');

      chain.reverse().forEach((block, index) => {
        blocks.push(
          <BlocksDetails
            block={block}
            key={index}
            match={this.props.match}
          />
        )
      });
    }

    return (
      <div className="Blocks nextPage">
        <div className="pure-u-1-1">
          <table className="pure-table">
            <tbody>
              {blocks}
            </tbody>
          </table>
        </div>
      </div>
    );
  }
}

export default Blocks;
