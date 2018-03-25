class Input {
  constructor(inputData) {
    this.coinbase = inputData.coinbase;
    this.scriptSig = inputData.scriptSig;
    this.txid = inputData.txid;
    this.vout = inputData.vout;
    this.sequence = inputData.sequence;
  }
}

export default Input;
