import Block from './Block';
import underscore from 'underscore';

class Blockchain {
  constructor() {
    this.chain = [];
    // this.difficulty = 0;
  }

  getLastBlock() {
    return underscore.last(this.chain);
  }

  addBlock(newBlock) {
    // newBlock.mineBlock(this.difficulty);
    if(newBlock.index === 0) {
      newBlock.previousBlockHeader = "#BCHForEveryone";
    } else {
      newBlock.previousBlockHeader = this.getLastBlock().header;
    }

    newBlock.header = newBlock.calculateHash();
    this.chain.push(newBlock);
  }

  // isChainValid() {
  //   for (let i = 1; i < this.chain.length; i++){
  //     const currentBlock = this.chain[i];
  //     const previousBlock = this.chain[i - 1];
  //
  //     if (currentBlock.hash !== currentBlock.calculateHash()) {
  //         return false;
  //     }
  //
  //     if (currentBlock.previousHash !== previousBlock.hash) {
  //         return false;
  //     }
  //   }
  //   return true;
  // }
}

export default Blockchain;
