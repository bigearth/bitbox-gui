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

    // blockchainInstance.addBlock(new Block(2, "20/07/2017", { amount: 8 }));

    // Check if chain is valid (will return true)
    // console.log('Blockchain valid? ' + blockchainInstance.isChainValid());

    // Let's now manipulate the data
    // blockchainInstance.chain[1].data = { amount: 100 };

    // Check our chain again (will now return false)
    // console.log("Blockchain valid? " + blockchainInstance.isChainValid());
  }

  handleBlockDetails(blockId) {
    this.setState({
      redirect: true,
      blockId: blockId
    })
  }

  render() {

    if (this.state.redirect) {
      return <Redirect
        push
        to={{
          pathname: `${this.props.match.url}/${this.state.blockId}`,
          state: {
            block: this.props.blockchainInstance.chain[this.state.blockId]
          }
        }}
      />
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
            handleBlockDetails={this.handleBlockDetails.bind(this)}
          />
        )
      });
    }

    return (
      <div className="Blocks">
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
