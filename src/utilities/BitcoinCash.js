import Address from '../models/Address';
import Crypto from './Crypto';

import Bitcoin from 'bitcoinjs-lib';
import BIP39 from 'bip39';
import bchaddr from 'bchaddrjs';
import sb from 'satoshi-bitcoin';
import bitcoinMessage from 'bitcoinjs-message';

class BitcoinCash {
  // Utility class to wrap the following bitcoin related npm packages
  // * https://github.com/bitcoinjs/bitcoinjs-lib
  // * https://github.com/bitcoinjs/bip39
  // * https://github.com/bitcoincashjs/bchaddrjs
  // * https://github.com/dawsbot/satoshi-bitcoin

  // Translate coins to satoshi value
  static toSatoshi(coins) {
    return sb.toSatoshi(coins);
  }

  // Translate satoshi to coin value
  static toBitcoinCash(satoshis) {
    return sb.toBitcoin(satoshis);
  }

  // Translate address from any address format into a specific format.
  static toLegacyAddress(address) {
    return bchaddr.toLegacyAddress(address);
  }

  static toCashAddress(address) {
    return bchaddr.toCashAddress(address);
  }

  // Test for address format.
  static isLegacyAddress(address) {
    return bchaddr.isLegacyAddress(address);
  }

  static isCashAddress(address) {
    return bchaddr.isCashAddress(address);
  }

  // Test for address network.
  static isMainnetAddress(address) {
    return bchaddr.isMainnetAddress(address);
  }

  static isTestnetAddress(address) {
    return bchaddr.isTestnetAddress(address);
  }

  // Test for address type.
  static isP2PKHAddress(address) {
    return bchaddr.isP2PKHAddress(address);
  }

  static isP2SHAddress(address) {
    return bchaddr.isP2SHAddress(address);
  }

  // Detect address format.
  static detectAddressFormat(address) {
    return bchaddr.detectAddressFormat(address);
  }

  // Detect address network.
  static detectAddressNetwork(address) {
    return bchaddr.detectAddressNetwork(address);
  }

  // Detect address type.
  static detectAddressType(address) {
    return bchaddr.detectAddressType(address);
  }

  static entropyToMnemonic(bytes = 16) {
    // Generate cryptographically strong pseudo-random data.
    // The bytes argument is a number indicating the number of bytes to generate.
    // Uses the NodeJS crypto lib. More info: https://nodejs.org/api/crypto.html#crypto_crypto_randombytes_size_callback
    let randomBytes = Crypto.randomBytes(bytes);

    // Create BIP 39 compliant mnemonic w/ entropy
    // Entropy (bits/bytes)	Checksum (bits)	Entropy + checksum (bits)	Mnemonic length (words)
    // 128/16               4               132                       12
    //
    // 160/20               5               165                       15
    //
    // 192/24               6               198                       18
    //
    // 224/28               7               231                       21
    //
    // 256/32               8               264                       24

    return BIP39.entropyToMnemonic(randomBytes);
  }

  static mnemonicToSeed(mnemonic, password = '') {
    // create BIP 39 compliant
    return BIP39.mnemonicToSeed(mnemonic, password);
  }

  static fromSeedBuffer(rootSeed, network = 'bitcoin') {
    return Bitcoin.HDNode.fromSeedBuffer(rootSeed, Bitcoin.networks[network]);
  }

  static fromWIF(privateKeyWIF, network = 'bitcoin') {
    return Bitcoin.ECPair.fromWIF(privateKeyWIF, Bitcoin.networks[network]);
  }

  static ECPair() {
    return Bitcoin.ECPair;
  }

  static address() {
    return Bitcoin.address;
  }

  static script() {
    return Bitcoin.script;
  }

  static transaction() {
    return Bitcoin.Transaction;
  }

  static transactionBuilder(network = 'bitcoin') {
    return new Bitcoin.TransactionBuilder(Bitcoin.networks[network]);
  }

  static fromTransaction() {
    return Bitcoin.TransactionBuilder;
  }


  static createHDWallet(config) {
    // nore info: https://github.com/bitcoinbook/bitcoinbook/blob/develop/ch05.asciidoc

    if(config.autogenerateMnemonic) {
      // create a random mnemonic w/ user provided entropy size
      config.mnemonic = BitcoinCash.entropyToMnemonic(config.entropy);
    }

    // create 512 bit HMAC-SHA512 root seed
    let rootSeed = BitcoinCash.mnemonicToSeed(config.mnemonic, config.password);

    // create master private key
    let masterkey = BitcoinCash.fromSeedBuffer(rootSeed, config.network);

    // let tmpkey = BitcoinCash.fromSeedBuffer(rootSeed);

    if(config.autogeneratePath) {
      // create BIP 44 HD path
      // m / purpose' / coin_type' / account' / change / address_index

      // purpose is always 44' to show the wallet is BIP 44 compliant
      let purpose = "44'";

      // BCH's coin code is 145'
      let coin = "145'";
      let path = `m/${purpose}/${coin}`;
      config.path = path;
    }

    let addresses = [];
    let account;
    let tmpPath;
    for (let i = 0; i < config.totalAccounts; i++) {
      // create accounts
      account = masterkey.derivePath(`${config.path.replace(/\/$/, "")}/${i}'`);

      // var keyhash = Bitcoin.crypto.hash160(account.getPublicKeyBuffer())
      // var scriptSig = Bitcoin.script.witnessPubKeyHash.output.encode(keyhash)
      // var addressBytes = Bitcoin.crypto.hash160(scriptSig)
      // var outputScript = Bitcoin.script.scriptHash.output.encode(addressBytes)
      // var address = Bitcoin.address.fromOutputScript(outputScript, Bitcoin.networks.testnet)
      // console.log(address.derive(0));

      // get 1st receiving address of account i
      addresses.push(new Address(account.derive(0).keyPair.toWIF()));
      // addresses.push(new Address(BitcoinCash.toCashAddress(account.derive(i).getAddress()), account.derive(i).keyPair.toWIF()));
    };

    return [config.mnemonic, config.path, addresses];
  }

  static signMessage(message, privateKey, keyPair) {
    return bitcoinMessage.sign(message, privateKey, keyPair.compressed);
  }

  static verifyMessage(message, address, signature) {
    return bitcoinMessage.verify(message, address, signature);
  }
}

export default BitcoinCash;
