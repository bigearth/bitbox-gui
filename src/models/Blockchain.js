import Block from './Block';

class Blockchain {
  constructor(genesisBlock) {
    this.chain = [this.createGenesisBlock(genesisBlock)];
    this.difficulty = 0;
  }

  createGenesisBlock(genesisBlock) {
    return new Block(genesisBlock);
  }

  getLatestBlock() {
    return this.chain[this.chain.length - 1];
  }

  addBlock(newBlock) {
    newBlock.mineBlock(this.difficulty);
    this.chain.push(newBlock);
  }

  isChainValid() {
    for (let i = 1; i < this.chain.length; i++){
      const currentBlock = this.chain[i];
      const previousBlock = this.chain[i - 1];

      if (currentBlock.hash !== currentBlock.calculateHash()) {
          return false;
      }

      if (currentBlock.previousHash !== previousBlock.hash) {
          return false;
      }
    }
    return true;
  }
}

export default Blockchain;
