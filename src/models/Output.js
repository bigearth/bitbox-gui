class Output {
  constructor(outputData) {
    this.hex = outputData.hex;
    this.outputPubKey = outputData.outputPubKey;
    this.script = outputData.script;
    this.value = outputData.value;
  }
}

export default Output;
