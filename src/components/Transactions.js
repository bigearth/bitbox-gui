import React, { Component } from 'react';
import Bitcoin from 'bitcoinjs-lib';

class Transactions extends Component {
  render() {
    if(this.props.addresses.length) {
      var alice = Bitcoin.ECPair.fromWIF(this.props.addresses[0].privateKeyWIF)
      var txb = new Bitcoin.TransactionBuilder()

      txb.addInput('0000000000000000000000000000000000000000000000000000000000000001', 0);
      txb.addOutput(this.props.addresses[1].publicKey, 12000)
      // (in)15000 - (out)12000 = (fee)3000, this is the miner fee

      txb.sign(0, alice);
      // console.log(txb.build().toHex());
    }
    // console.log(tx.sign(0, key));
    // if(this.props.addresses.length) {
    //
    //   console.log(this.props.addresses);
    //   var coinbase = Bitcoin.ECPair.fromWIF(this.props.addresses[0].private);
    //   var txb = new Bitcoin.TransactionBuilder()
    //
    //   txb.addInput('61d520ccb74288c96bc1a2b20ea1c0d5a704776dd0164a396efec3ea7040349d', 0) // Alice's previous transaction output, has 15000 satoshis
    //   txb.addOutput('1cMh228HTCiwS8ZsaakH8A8wze1JR5ZsP', 12000)
    //   // (in)15000 - (out)12000 = (fee)3000, this is the miner fee
    //
    //   txb.sign(0, coinbase)
    //   console.log(txb.build().toHex());
    //
    // }
    return (
      <div className="Transactions">
        <h1 className="App-title">Transactions</h1>
      </div>
    );
  }
}

export default Transactions;
