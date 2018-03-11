import React, { Component } from 'react';
import Block from './Block';
import underscore from 'underscore';

class Blocks extends Component {
  constructor(props) {
    super(props);
  }

  render() {

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
