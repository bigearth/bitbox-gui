class Transaction {
  constructor(transactionData) {
    this.size = transactionData.size;
    this.vsize = transactionData.vsize;
    this.value = transactionData.value;
    this.rawHex = transactionData.rawHex;
    this.timestamp = transactionData.timestamp;
    this.txid = transactionData.txid;
    this.inputs = transactionData.inputs;
    this.outputs = transactionData.outputs;
    this.hash = transactionData.hash;
  }
}

export default Transaction;
