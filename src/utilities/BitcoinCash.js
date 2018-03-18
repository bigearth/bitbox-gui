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

  static createHDWallet(config) {
    let language = config.language;

    if(!language || (language !== 'chinese_simplified' && language !== 'chinese_traditional' && language !== 'english' && language !== 'french' && language !== 'italian' && language !== 'japanese' && language !== 'korean' && language !== 'spanish')) {
      config.language = 'english';
    }

    let mnemonic = config.mnemonic;
    if(config.autogenerateHDMnemonic) {
      // create a random mnemonic w/ user provided entropy size
      let randomBytes = bitbox.Crypto.randomBytes(config.entropy);
      mnemonic = bitbox.BitcoinCash.Mnemonic.entropyToMnemonic(randomBytes, bitbox.BitcoinCash.Mnemonic.mnemonicWordLists()[config.language]);
    }

    // create root seed buffer
    let rootSeedBuffer = bitbox.BitcoinCash.Mnemonic.mnemonicToSeedBuffer(mnemonic, config.password);

    // create master hd node
    let masterHDNode = bitbox.BitcoinCash.HDNode.fromSeedBuffer(rootSeedBuffer, config.network);

    let HDPath = `m/${config.HDPath.purpose}/${config.HDPath.coinCode}`

    let accounts = [];

    for (let i = 0; i < config.totalAccounts; i++) {
      // create accounts
      let account = masterHDNode.derivePath(`${HDPath.replace(/\/$/, "")}/${i}'`);
      let xpriv = bitbox.BitcoinCash.HDNode.toXPriv(account);
      let xpub = bitbox.BitcoinCash.HDNode.toXPub(account);
      let address = account.derivePath(`${config.HDPath.change}/${config.HDPath.address_index}`);

      accounts.push({
        title: '',
        privateKeyWIF: address.keyPair.toWIF(),
        xpriv: xpriv,
        xpub: xpub,
        index: i
      });
    };

    return [mnemonic, config.HDPath, accounts];
  }
}

export default BitcoinCash;
