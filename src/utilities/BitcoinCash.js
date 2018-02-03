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

  static entropyToMnemonic() {
    return BIP39.entropyToMnemonic(Crypto.randomBytes());
  }

  static mnemonicToSeed(mnemonic) {
    return BIP39.mnemonicToSeed(mnemonic, '');
  }

  static fromSeedBuffer(seed) {
    return Bitcoin.HDNode.fromSeedBuffer(seed, Bitcoin.networks['bitcoin']);
  }

  static fromWIF(privateKeyWIF) {
    return Bitcoin.ECPair.fromWIF(privateKeyWIF);
  }

  static transaction() {
    return new Bitcoin.Transaction();
  }

  static transactionBuilder() {
    return new Bitcoin.TransactionBuilder();
  }

  static createHDWallet(config) {
    if(!config.mnemonic && config.autogenerateMnemonic) {
      config.mnemonic = BitcoinCash.entropyToMnemonic();
    }

    if(!config.path && config.autogeneratePath) {
      let depth = Math.floor(Math.random() * 11);

      let path = "m/44'/0'";
      for(let i = 0; i <= depth; i++) {
        let child = Math.floor(Math.random() * 100);
        path = `${path}/${child}'`;
      }
      config.path = path;
    } else {
      config.path = config.path;
    }

    const seed = BitcoinCash.mnemonicToSeed(config.mnemonic);
    const masterkey = BitcoinCash.fromSeedBuffer(seed);

    const account = masterkey.derivePath(config.path);

    const addresses = [];
    for (let i = 0; i < config.totalAccounts; i++) {
      addresses.push(new Address(account.derive(i).keyPair.toWIF()));
      // addresses.push(new Address(BitcoinCash.toCashAddress(account.derive(i).getAddress()), account.derive(i).keyPair.toWIF()));
    };

    return [config.mnemonic, config.path, addresses];
  }
}

export default BitcoinCash;
