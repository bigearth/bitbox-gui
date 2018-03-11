class Transaction {
  constructor(transactionData) {
    this.inputs = transactionData.inputs;
    this.outputs = transactionData.outputs;
  }

  //
  // createCoinbaseTransaction(address) {
  //   let coinbaseTransaction = new bitbox.BitcoinCash.transaction();
  //   coinbaseTransaction.addInput(new Buffer('0000000000000000000000000000000000000000000000000000000000000000', 'hex'), 0);
  //   coinbaseTransaction.addOutput(new Buffer(address, 'hex'), 5000000000);
  //   // let coinbaseTransactionHash = bitbox.Crypto.createSHA256Hash(coinbaseTransaction.toHex());
  // }
}

export default Transaction;
