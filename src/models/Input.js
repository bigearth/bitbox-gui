class Input {
  constructor(inputData) {
    this.coinbase = inputData.coinbase;
    this.scriptSig = inputData.scriptSig;
    this.txid = inputData.txid;
    this.sequence = inputData.sequence;
  }
}

export default Input;
