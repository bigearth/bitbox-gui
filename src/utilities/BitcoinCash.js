import Address from '../models/Address';

import Bitcoin from 'bitcoinjs-lib';
let BITBOXCli = require('bitbox-cli/lib/bitboxcli').default;
let bitbox = new BITBOXCli();
import underscore from 'underscore';

class BitcoinCash {
  static returnPrivateKeyWIF(pubAddress, accounts) {
    let address = bitbox.BitcoinCash.Address.toCashAddress(pubAddress);
    let privateKeyWIF;

    let errorMsg = '';
    accounts.forEach((account, index) => {
      account.previousAddresses.forEach((addy, i) => {
        if(address === addy) {
          privateKeyWIF = account.privateKeyWIF
        }
      });
    });
    //
    // try {
    //   privateKeyWIF = (encoding === 'cashAddr') ? underscore.findWhere(accounts, ({cashAddr: pubAddress})) : underscore.findWhere(accounts, ({legacy: pubAddress}));
    // } catch (e) {
    //   errorMsg = e.message;
    // }
    //
    if(errorMsg !== '') {
      return errorMsg;
    } else {
      return privateKeyWIF;
    }
  }

  static createMultiSig(nrequired, keys, addresses, wallet) {
    let keyPairs = [];
    let pubKeys = [];
    keys.forEach((key, index) => {
      if(key.toString('hex').length === 66) {
        pubKeys.push(key);
      } else {
        let privkeyWIF = BitcoinCash.returnPrivateKeyWIF(key, addresses);
        keyPairs.push(bitbox.BitcoinCash.fromWIF(privkeyWIF, wallet.network))
      }
    })

    keyPairs.forEach((key, index) => {
      pubKeys.push(key.getPublicKeyBuffer());
    })
    pubKeys.map((hex) => { return Buffer.from(hex, 'hex') })

    let redeemScript = Bitcoin.script.multisig.output.encode(nrequired, pubKeys)
    let scriptPubKey = Bitcoin.script.scriptHash.output.encode(Bitcoin.crypto.hash160(redeemScript))
    let address = Bitcoin.address.fromOutputScript(scriptPubKey)

    return {
      address: address,
      redeemScript: redeemScript
    };
  }
}

export default BitcoinCash;
