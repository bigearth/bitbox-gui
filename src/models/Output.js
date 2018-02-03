class Output {
  constructor(outputData) {
    this.value = outputData.value;
    this.txoutScriptLength = 0;
    this.scriptPubKey = `OP_DUP OP_HASH160 ${outputData.ripemd160} OP_EQUALVERIFY OP_CHECKSIG`;
    this.ripemd160 = outputData.ripemd160;
  }
}

export default Output;
