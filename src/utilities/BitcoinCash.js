import Address from '../models/Address';

import Bitcoin from 'bitcoinjs-lib';
let BITBOXCli = require('bitbox-cli/lib/bitboxcli').default;
let bitbox = new BITBOXCli();


class BitcoinCash {
  static signMessage(message, privateKeyWIF) {

    let keyPair;
    let errorMsg = '';
    try {
      keyPair = bitbox.BitcoinCash.fromWIF(privateKeyWIF);
    } catch (e) {
      errorMsg = e.message;
    }

    if(errorMsg !== '') {
      return errorMsg;
    }

    let privateKey = keyPair.d.toBuffer(32);
    let signature = BitcoinCash.sign(message, privateKeyWIF);
    let signature1 = signature.toString('base64')
    return signature1;
  }

  static sign(message, privateKeyWIF) {
    return bitbox.BitcoinCash.signMessageWithPrivKey(privateKeyWIF, message);
  }

  static returnPrivateKeyWIF(pubAddress, addresses) {
    let privateKeyWIF;
    let errorMsg = '';
    try {
      addresses.forEach((address, index) => {
        if(bitbox.BitcoinCash.toLegacyAddress(pubAddress) === bitbox.BitcoinCash.fromWIF(address.privateKeyWIF).getAddress()) {
          privateKeyWIF = address.privateKeyWIF;
        }
      });
    } catch (e) {
      errorMsg = e.message;
    }

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
