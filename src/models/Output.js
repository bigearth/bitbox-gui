class Output {
  constructor(outputData) {
    this.value = outputData.value;
    this.scriptPubKey = `OP_DUP OP_HASH160 ${outputData.ripemd160} OP_EQUALVERIFY OP_CHECKSIG`;
  }
}

export default Output;
