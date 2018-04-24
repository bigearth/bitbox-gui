import BitcoinCash from '../src/utilities/BitcoinCash';
import chai from 'chai';
let assert = chai.assert;
let fixtures = require('./fixtures/BitcoinCash.json')
let BITBOXCli = require('bitbox-cli/lib/bitboxcli').default;
let bitbox = new BITBOXCli();

describe('price conversion', () => {
  it('should convert Bitcoin Cash to Satoshis', () => {
    let bitcoinCash = 12.5;
    let satoshis = bitbox.BitcoinCash.toSatoshi(bitcoinCash);
    assert.equal(satoshis, 1250000000);
  });

  it('should convert Satoshis to Bitcoin Cash', () => {
    let satoshis = 1250000000;
    let bitcoinCash = bitbox.BitcoinCash.toBitcoinCash(satoshis);
    assert.equal(bitcoinCash, 12.5);
  });
});

describe('address conversion', () => {
  it('should convert base58Check address to cashaddr', () => {
    let base58Check = fixtures.base58check;
    let cashaddr = bitbox.Address.toCashAddress(base58Check);
    assert.equal(cashaddr, fixtures.cashaddr);
  });

  it('should convert cashaddr address to base58Check', () => {
    let cashaddr = fixtures.cashaddr;
    let base58Check = bitbox.Address.toLegacyAddress(cashaddr);
    assert.equal(base58Check, fixtures.base58check);
  });
});

describe('address format detection', () => {
  it('should detect base58Check address', () => {
    let base58Check = fixtures.base58check;
    let isBase58Check = bitbox.Address.isLegacyAddress(base58Check);
    assert.equal(isBase58Check, true);
  });

  it('should detect cashaddr address', () => {
    let cashaddr = fixtures.cashaddr;
    let isCashaddr = bitbox.Address.isCashAddress(cashaddr);
    assert.equal(isCashaddr, true);
  });
});

describe('network detection', () => {
  it('should detect mainnet address', () => {
    let mainnet = fixtures.base58check;
    let isMainnet = bitbox.Address.isMainnetAddress(mainnet);
    assert.equal(isMainnet, true);
  });

  it('should detect testnet address', () => {
    let testnet = fixtures.testnet;
    let isTestnet = bitbox.Address.isTestnetAddress(testnet);
    assert.equal(isTestnet, true);
  });
});

describe('address type detection', () => {
  it('should detect P2PKH address', () => {
    let P2PKH = fixtures.base58check;
    let isP2PKH = bitbox.Address.isP2PKHAddress(P2PKH);
    assert.equal(isP2PKH, true);
  });

  it('should detect P2SH address', () => {
    let P2SH = fixtures.P2SH;
    let isP2SH = bitbox.Address.isP2SHAddress(P2SH);
    assert.equal(isP2SH, true);
  });
});

describe('return address format', () => {
  it('should return base58Check address', () => {
    let base58Check = fixtures.base58check;
    let isBase58Check = bitbox.Address.detectAddressFormat(base58Check);
    assert.equal(isBase58Check, 'legacy');
  });

  it('should return cashaddr address', () => {
    let cashaddr = fixtures.cashaddr;
    let isCashaddr = bitbox.Address.detectAddressFormat(cashaddr);
    assert.equal(isCashaddr, 'cashaddr');
  });
});

describe('return address network', () => {
  it('should return mainnet', () => {
    let mainnet = fixtures.base58check;
    let isMainnet = bitbox.Address.detectAddressNetwork(mainnet);
    assert.equal(isMainnet, 'mainnet');
  });

  it('should return testnet', () => {
    let testnet = fixtures.testnet;
    let isTestnet = bitbox.Address.detectAddressNetwork(testnet);
    assert.equal(isTestnet, 'testnet');
  });
});

describe('return address type', () => {
  it('should return P2PKH', () => {
    let P2PKH = fixtures.base58check;
    let isP2PKH = bitbox.Address.detectAddressType(P2PKH);
    assert.equal(isP2PKH, 'p2pkh');
  });

  it('should return P2SH', () => {
    let P2SH = fixtures.P2SH;
    let isP2SH = bitbox.Address.detectAddressType(P2SH);
    assert.equal(isP2SH, 'p2sh');
  });
});

describe('generate specific length mnemonic', () => {
  it('should generate a 12 word mnemonic', () => {
    let mnemonic = bitbox.Mnemonic.generate(128);
    assert.lengthOf(mnemonic.split(' '), 12);
  });

  it('should generate a 15 word mnemonic', () => {
    let mnemonic = bitbox.Mnemonic.generate(160);
    assert.lengthOf(mnemonic.split(' '), 15);
  });

  it('should generate an 18 word mnemonic', () => {
    let mnemonic = bitbox.Mnemonic.generate(192);
    assert.lengthOf(mnemonic.split(' '), 18);
  });

  it('should generate an 21 word mnemonic', () => {
    let mnemonic = bitbox.Mnemonic.generate(224);
    assert.lengthOf(mnemonic.split(' '), 21);
  });

  it('should generate an 24 word mnemonic', () => {
    let mnemonic = bitbox.Mnemonic.generate(256);
    assert.lengthOf(mnemonic.split(' '), 24);
  });
});

describe('create 512 bit HMAC-SHA512 root seed', () => {
  let rootSeed = bitbox.Mnemonic.toSeed(bitbox.Mnemonic.generate(256), 'password');
  it('should create 64 byte root seed', () => {
    assert.equal(rootSeed.byteLength, 64);
  });

  it('should create root seed hex encoded', () => {
    assert.lengthOf(rootSeed.toString('hex'), 128);
  });
});

describe('create master private key', () => {
  it('should create 32 byte chain code', () => {
    let rootSeed = bitbox.Mnemonic.toSeed(bitbox.Mnemonic.generate(256), 'password');
    let masterkey = bitbox.HDNode.fromSeed(rootSeed);
    assert.equal(masterkey.chainCode.byteLength, 32);
  });
});

describe('sign and verify messages', () => {
  it('should sign a message and produce an 88 character signature in base64 encoding', () => {

    let privateKeyWIF = '5KYZdUEo39z3FPrtuX2QbbwGnNP5zTd7yyr2SC1j299sBCnWjss'
    let message = 'This is an example of a signed message.'

    let signature = bitbox.BitcoinCash.signMessageWithPrivKey(privateKeyWIF, message)
    assert.equal(signature.length, 88);
  });

  it('should verify a valid signed message', () => {

    let address = '1HZwkjkeaoZfTSaJxDw6aKkxp45agDiEzN'
    let signature = 'HJLQlDWLyb1Ef8bQKEISzFbDAKctIlaqOpGbrk3YVtRsjmC61lpE5ErkPRUFtDKtx98vHFGUWlFhsh3DiW6N0rE'
    let message = 'This is an example of a signed message.'

    assert.equal(bitbox.BitcoinCash.verifyMessage(address, signature, message), true);
  });

  it('should not verify a invalid signed message', () => {

    let address = '1HZwkjkeaoZfTSaJxDw6aKkxp45agDiEzN'
    let signature = 'HJLQlDWLyb1Ef8bQKEISzFbDAKctIlaqOpGbrk3YVtRsjmC61lpE5ErkPRUFtDKtx98vHFGUWlFhsh3DiW6N0rE'
    let message = 'This is an example of an invalid message.'

    assert.equal(bitbox.BitcoinCash.verifyMessage(address, signature, message), false);
  });
});
