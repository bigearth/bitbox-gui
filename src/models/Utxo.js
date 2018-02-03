class Utxo {
  constructor() {
    this.outputs = [];
  }

  addUtxo(address, value) {
    let outputs = this.outputs;
    outputs.push({
      address: address,
      value: value
    })
  }
}

export default Utxo;
