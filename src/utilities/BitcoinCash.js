import Address from '../models/Address';

import Bitcoin from 'bitcoinjs-lib';
let BITBOXCli = require('bitbox-cli/lib/bitboxcli').default;
let bitbox = new BITBOXCli();
import underscore from 'underscore';

class BitcoinCash {
  static returnPrivateKeyWIF(pubAddress, accounts) {
    let address = bitbox.Address.toCashAddress(pubAddress);
    let privateKeyWIF;

    let errorMsg = '';
    accounts.forEach((account, index) => {
      account.previousAddresses.forEach((addy, i) => {
        if(address === addy) {
          privateKeyWIF = account.privateKeyWIF
        }
      });
    });
    
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
        keyPairs.push(bitbox.HDNode.fromWIF(privkeyWIF, wallet.network))
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

  static createAccounts(config) {
    let language = config.language;

    if(!language || (language !== 'chinese_simplified' && language !== 'chinese_traditional' && language !== 'english' && language !== 'french' && language !== 'italian' && language !== 'japanese' && language !== 'korean' && language !== 'spanish')) {
      config.language = 'english';
    }

    // create root seed buffer
    let rootSeedBuffer = bitbox.Mnemonic.mnemonicToSeedBuffer(config.mnemonic, config.password);

    // create master hd node
    let masterHDNode = bitbox.HDNode.fromSeedBuffer(rootSeedBuffer, config.network);

    let HDPath = `m/${config.HDPath.purpose}/${config.HDPath.coinCode}`

    let accounts = [];

    for (let i = 0; i < config.totalAccounts; i++) {
      // create accounts
      let account = masterHDNode.derivePath(`${HDPath.replace(/\/$/, "")}/${i}'`);
      let external = account.derivePath("0")
      account.addresses = bitbox.HDNode.createAccount([external]);
      accounts.push(account);
    };

    return accounts;
  }
}

export default BitcoinCash;
