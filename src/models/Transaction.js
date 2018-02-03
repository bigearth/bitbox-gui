import BitcoinCash from '../utilities/BitcoinCash';
// import Crypto from '../utilities/Crypto';

class Transaction {
  constructor(transactionData, isCoinbase = false) {
    this.versionNumber = transactionData.versionNumber;
    this.inputCounter = transactionData.inputs.length;
    this.inputs = transactionData.inputs;
    this.outputCounter = transactionData.outputs.length;
    this.outputs = transactionData.outputs;
    this.lockTime = transactionData.time;

    if(isCoinbase) {
      this.createCoinbaseTransaction(transactionData.address);
    }
  }


  createCoinbaseTransaction(address) {
    let coinbaseTransaction = new BitcoinCash.transaction();
    coinbaseTransaction.addInput(new Buffer('0000000000000000000000000000000000000000000000000000000000000000', 'hex'), 0);
    coinbaseTransaction.addOutput(new Buffer(address, 'hex'), 5000000000);
    // console.log(coinbaseTransaction.isCoinbase());
    // let coinbaseTransactionHash = Crypto.createSHA256Hash(coinbaseTransaction.toHex());
    // console.log(coinbaseTransactionHash);
  }
}

export default Transaction;
