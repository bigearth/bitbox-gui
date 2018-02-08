import BitcoinCash from './BitcoinCash'
import Block from '../models/Block';


class Miner {
  constructor(blockchain) {
    this.blockchain = blockchain;
  }

  pushGenesisTx(rawHex) {
    this.mineBlock([{
      rawHex: rawHex,
      timestamp: Date.now()
    }], 0);
  }

  mineBlock(transactions, index) {
    this.blockchain.addBlock(new Block({
      transactions: transactions,
      index: index
    }));
  }
}

export default Miner;
