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

  handleSubmit(searchTerm, blockchain, wallet, event) {
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
      <span className="input-icon-wrap">
        <form onSubmit={this.handleSubmit.bind(this, this.props.explorer.searchTerm, this.props.blockchain, this.props.wallet)}>
          <input id="form-name" onChange={this.props.updateExplorerValue.bind(this)} value={this.props.explorer.searchTerm} placeholder="SEARCH BLOCK AND TRANSACTIONS" type="text" className="pure-input-rounded input-with-icon" />
        </form>
        <span className="input-icon"><i className="fas fa-search" /></span>
      </span>
    );
  }
}

export default Explorer;
