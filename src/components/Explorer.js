import React, { Component } from 'react';

import underscore from 'underscore';

class Explorer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      redirect: false,
      blockIndex: null,
      hash: null
    }
  }

  handleSubmit(searchTerm, blockchain, wallet) {
    let index;
    let result;
    if(searchTerm !== '') {
      // first search by block index
      result = underscore.findWhere(blockchain.chain, {index: +searchTerm});
      if(!result) {
        // next search by block header
        result = underscore.findWhere(blockchain.chain, {header: searchTerm});
      }
    }

    if(result) {
      this.props.history.push(`/blocks/${result.index}`)
    } else {

      blockchain.chain.forEach((block) => {
        block.transactions.forEach((tx) => {
          // next search by tx hash and raw hex
          if(tx.hash === searchTerm || tx.rawHex === searchTerm) {
            result = tx;
            index = block.index;
          }
        })
      })

      if(result) {
        this.props.history.push(`/blocks/${index}/transactions/${result.hash}`)
      }
    }
    this.props.resetValue();
    event.preventDefault();
  }

  render() {
    return (
      <span>
        <button onClick={this.handleSubmit.bind(this, this.props.explorer.searchTerm, this.props.blockchain, this.props.wallet)} type="submit" className="pure-button danger-background">Search</button>
        <input onChange={this.props.updateValue.bind(this)} value={this.props.explorer.searchTerm} placeholder="SEARCH BLOCKS/ADDRESSES/TXS" type="text" className="pure-input-rounded" />
      </span>
    );
  }
}

export default Explorer;
