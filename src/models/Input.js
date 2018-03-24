class Input {
  constructor(inputData) {
    this.scriptSig = inputData.scriptSig;
    this.txid = inputData.txid;
    this.vout = inputData.vout;
    this.sequence = inputData.sequence;
  }
}

export default Input;
