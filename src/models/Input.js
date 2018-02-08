class Input {
  constructor(inputData) {

    this.txid = inputData.txid;
    this.vout = inputData.vout;
    this.scriptSig = inputData.scriptSig;
  }
}

export default Input;
