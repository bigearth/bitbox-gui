import React, { Component } from 'react';
import Block from './Block';
import underscore from 'underscore';
import {
  Redirect
} from 'react-router-dom';

class Blocks extends Component {
  constructor(props) {
    super(props);
    this.state = {
      redirect: false
    };
  }

  render() {
    // if(this.state.redirect) {
    //   return (<Redirect to={{
    //     pathname: `${this.props.match.url}/${this.state.blockId}`,
    //     state: {
    //       block: this.props.chain[this.state.blockId]
    //     }
    //   }} />)
    // }

    let blocks = [];
    if(this.props.blockchain.chain.length) {
      let chain = underscore.sortBy(this.props.blockchain.chain, 'index');
      chain.reverse().forEach((block, index) => {
        blocks.push(
          <Block
            block={block}
            key={index}
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
