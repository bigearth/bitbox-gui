import BitcoinCash from '../src/utilities/BitcoinCash';
let chai = require('chai');
let assert = chai.assert;

describe('price conversion', () => {
  it('should convert Bitcoin Cash to Satoshis', () => {
    let bitcoinCash = 12.5;
    let satoshis = BitcoinCash.toSatoshi(bitcoinCash);

    assert.equal(satoshis, 1250000000);
  });

  it('should convert Satoshis to Bitcoin Cash', () => {
    let satoshis = 1250000000;
    let bitcoinCash = BitcoinCash.toBitcoinCash(satoshis);

    assert.equal(bitcoinCash, 12.5);
  });
});

describe('address conversion', () => {
  it('should convert base58Check address to cashaddr', () => {
    let base58Check = '14pjfbNNaXnuLztCmTCZqJsFJoZ6qmtU8f';
    let cashaddr = BitcoinCash.toCashAddress(base58Check);

    assert.equal(cashaddr, 'bitcoincash:qq57lzhk6qtdny7lwq3amk5npqssmxztrcq0m4arnd');
  });

  it('should convert cashaddr address to base58Check', () => {
    let cashaddr = 'bitcoincash:qq57lzhk6qtdny7lwq3amk5npqssmxztrcq0m4arnd';
    let base58Check = BitcoinCash.toLegacyAddress(cashaddr);

    assert.equal(base58Check, '14pjfbNNaXnuLztCmTCZqJsFJoZ6qmtU8f');
  });
});

describe('address format detection', () => {
  it('should detect base58Check address', () => {
    let base58Check = '14pjfbNNaXnuLztCmTCZqJsFJoZ6qmtU8f';
    let isBase58Check = BitcoinCash.isLegacyAddress(base58Check);

    assert.equal(isBase58Check, true);
  });

  it('should detect cashaddr address', () => {
    let cashaddr = 'bitcoincash:qq57lzhk6qtdny7lwq3amk5npqssmxztrcq0m4arnd';
    let isCashaddr = BitcoinCash.isCashAddress(cashaddr);

    assert.equal(isCashaddr, true);
  });
});

describe('network detection', () => {
  it('should detect mainnet address', () => {
    let mainnet = '14pjfbNNaXnuLztCmTCZqJsFJoZ6qmtU8f';
    let isMainnet = BitcoinCash.isMainnetAddress(mainnet);

    assert.equal(isMainnet, true);
  });

  it('should detect testnet address', () => {
    let testnet = 'mj1jnRqWdqWdWn5Qqh5vdZqVKU1WmuzaGJ';
    let isTestnet = BitcoinCash.isTestnetAddress(testnet);

    assert.equal(isTestnet, true);
  });
});

describe('address type detection', () => {
  it('should detect P2PKH address', () => {
    let P2PKH = '14pjfbNNaXnuLztCmTCZqJsFJoZ6qmtU8f';
    let isP2PKH = BitcoinCash.isP2PKHAddress(P2PKH);

    assert.equal(isP2PKH, true);
  });

  it('should detect P2SH address', () => {
    let P2SH = 'H92i9XpREZiBscxGu6Vx3M8jNGBKqscBBB';
    let isP2SH = BitcoinCash.isP2SHAddress(P2SH);

    assert.equal(isP2SH, true);
  });
});

describe('return address format', () => {
  it('should return base58Check address', () => {
    let base58Check = '14pjfbNNaXnuLztCmTCZqJsFJoZ6qmtU8f';
    let isBase58Check = BitcoinCash.detectAddressFormat(base58Check);

    assert.equal(isBase58Check, 'legacy');
  });

  it('should return cashaddr address', () => {
    let cashaddr = 'bitcoincash:qq57lzhk6qtdny7lwq3amk5npqssmxztrcq0m4arnd';
    let isCashaddr = BitcoinCash.detectAddressFormat(cashaddr);

    assert.equal(isCashaddr, 'cashaddr');
  });
});

describe('return address network', () => {
  it('should return mainnet', () => {
    let mainnet = '14pjfbNNaXnuLztCmTCZqJsFJoZ6qmtU8f';
    let isMainnet = BitcoinCash.detectAddressNetwork(mainnet);

    assert.equal(isMainnet, 'mainnet');
  });

  it('should return testnet', () => {
    let testnet = 'mj1jnRqWdqWdWn5Qqh5vdZqVKU1WmuzaGJ';
    let isTestnet = BitcoinCash.detectAddressNetwork(testnet);

    assert.equal(isTestnet, 'testnet');
  });
});

describe('return address type', () => {
  it('should return P2PKH', () => {
    let P2PKH = '14pjfbNNaXnuLztCmTCZqJsFJoZ6qmtU8f';
    let isP2PKH = BitcoinCash.detectAddressType(P2PKH);

    assert.equal(isP2PKH, 'p2pkh');
  });

  it('should return P2PKH', () => {
    let P2SH = 'H92i9XpREZiBscxGu6Vx3M8jNGBKqscBBB';
    let isP2SH = BitcoinCash.detectAddressType(P2SH);

    assert.equal(isP2SH, 'p2sh');
  });
});

describe('return hex encoded entropy', () => {
  it('should return 16 bytes of entropy hex encoded', () => {
    let entropy = BitcoinCash.randomBytes(16);
    assert.lengthOf(entropy, 32);
  });

  it('should return 20 bytes of entropy hex encoded', () => {
    let entropy = BitcoinCash.randomBytes(20);
    assert.lengthOf(entropy, 40);
  });

  it('should return 24 bytes of entropy hex encoded', () => {
    let entropy = BitcoinCash.randomBytes(24);
    assert.lengthOf(entropy, 48);
  });

  it('should return 28 bytes of entropy hex encoded', () => {
    let entropy = BitcoinCash.randomBytes(28);
    assert.lengthOf(entropy, 56);
  });

  it('should return 20 bytes of entropy hex encoded', () => {
    let entropy = BitcoinCash.randomBytes(32);
    assert.lengthOf(entropy, 64);
  });
});

describe('generate specific length mnemonic', () => {
  it('should generate a 12 word mnemonic', () => {
    let mnemonic = BitcoinCash.entropyToMnemonic(16);

    assert.lengthOf(mnemonic.split(' '), 12);
  });

  it('should generate a 15 word mnemonic', () => {
    let mnemonic = BitcoinCash.entropyToMnemonic(20);

    assert.lengthOf(mnemonic.split(' '), 15);
  });

  it('should generate an 18 word mnemonic', () => {
    let mnemonic = BitcoinCash.entropyToMnemonic(24);

    assert.lengthOf(mnemonic.split(' '), 18);
  });

  it('should generate an 21 word mnemonic', () => {
    let mnemonic = BitcoinCash.entropyToMnemonic(28);

    assert.lengthOf(mnemonic.split(' '), 21);
  });

  it('should generate an 24 word mnemonic', () => {
    let mnemonic = BitcoinCash.entropyToMnemonic(32);

    assert.lengthOf(mnemonic.split(' '), 24);
  });
});
