// import BlockHeader from './BlockHeader';
// import Utxo from './Utxo';

class Block {
  constructor(blockData) {
    this.index               = blockData.index;
    this.transactions        = blockData.transactions;
    this.timestamp           = blockData.timestamp;
    this.previousBlockHeader;
    this.header;
  }
}

export default Block;
