import Block from './Block';
import underscore from 'underscore';

class Blockchain {
  constructor() {
    this.chain = [];
    // this.difficulty = 0;
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
