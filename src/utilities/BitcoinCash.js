import Address from '../models/Address';
import Crypto from './Crypto';

import Bitcoin from 'bitcoinjs-lib';
import BIP39 from 'bip39';
import bchaddr from 'bchaddrjs';
import sb from 'satoshi-bitcoin';


class BitcoinCash {
  // Utility class to wrap the following bitcoin related npm packages
  // * https://github.com/bitcoinjs/bitcoinjs-lib
  // * https://github.com/bitcoinjs/bip39
  // * https://github.com/bitcoincashjs/bchaddrjs

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

  static toBitpayAddress(address) {
    return bchaddr.toBitpayAddress(address);
  }

  static toCashAddress(address) {
    return bchaddr.toCashAddress(address);
  }

  // Test for address format.
  static isLegacyAddress(address) {
    return bchaddr.isLegacyAddress(address);
  }

  static isBitpayAddress(address) {
    return bchaddr.isBitpayAddress(address);
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

  static entropyToMnemonic(bits = 16) {
    return BIP39.entropyToMnemonic(Crypto.randomBytes(bits));
  }

  static mnemonicToSeed(mnemonic, password = '') {
    return BIP39.mnemonicToSeed(mnemonic, password);
  }

  static fromSeedBuffer(rootSeed, network = 'bitcoin') {
    return Bitcoin.HDNode.fromSeedBuffer(rootSeed, Bitcoin.networks[network]);
  }

  static fromWIF(privateKeyWIF, network = 'bitcoin') {
    return Bitcoin.ECPair.fromWIF(privateKeyWIF, Bitcoin.networks[network]);
  }

  static transaction() {
    return new Bitcoin.Transaction();
  }

  static transactionBuilder() {
    return new Bitcoin.TransactionBuilder();
  }

  static createHDWallet(config) {
    // nore info: https://github.com/bitcoinbook/bitcoinbook/blob/develop/ch05.asciidoc

    if(config.autogenerateMnemonic) {
      // create a 512 byte HMAC-SHA512 random mnemonic w/ user provided entropy size
      config.mnemonic = BitcoinCash.entropyToMnemonic(config.entropy);
    }

    // create 512 byte HMAC-SHA512 root seed
    let rootSeed = BitcoinCash.mnemonicToSeed(config.mnemonic, config.password);

    // create master private key
    let masterkey = BitcoinCash.fromSeedBuffer(rootSeed, config.network);

    // let tmpkey = BitcoinCash.fromSeedBuffer(rootSeed);

    if(config.autogeneratePath) {
      // create random BIP 44 HD path
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
}

export default BitcoinCash;
