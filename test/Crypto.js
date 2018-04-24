let chai = require('chai');
let assert = chai.assert;
let BITBOXCli = require('bitbox-cli/lib/bitboxcli').default;
let bitbox = new BITBOXCli();

describe('create SHA256Hash', () => {
  it('should create a SHA256Hash hex encoded', () => {
    let sha256Hash = bitbox.Crypto.sha256('foobar');
    assert.lengthOf(sha256Hash.toString('hex'), 64);
    assert.equal(sha256Hash.toString('hex'), 'c3ab8ff13720e8ad9047dd39466b3c8974e592c2fa383d4a3960714caef0c4f2');
  });
});

describe('create RIPEMD160Hash', () => {
  it('should create a RIPEMD160Hash hex encoded', () => {
    let RIPEMD160Hash = bitbox.Crypto.ripemd160('foobar');
    assert.lengthOf(RIPEMD160Hash.toString('hex'), 40);
    assert.equal(RIPEMD160Hash.toString('hex'), 'a06e327ea7388c18e4740e350ed4e60f2e04fc41');
  });
});

describe('return hex encoded entropy', () => {
  it('should return 16 bytes of entropy hex encoded', () => {
    let entropy = bitbox.Crypto.randomBytes(16);
    assert.lengthOf(entropy.toString('hex'), 32);
  });

  it('should return 20 bytes of entropy hex encoded', () => {
    let entropy = bitbox.Crypto.randomBytes(20);
    assert.lengthOf(entropy.toString('hex'), 40);
  });

  it('should return 24 bytes of entropy hex encoded', () => {
    let entropy = bitbox.Crypto.randomBytes(24);
    assert.lengthOf(entropy.toString('hex'), 48);
  });

  it('should return 28 bytes of entropy hex encoded', () => {
    let entropy = bitbox.Crypto.randomBytes(28);
    assert.lengthOf(entropy.toString('hex'), 56);
  });

  it('should return 20 bytes of entropy hex encoded', () => {
    let entropy = bitbox.Crypto.randomBytes(32);
    assert.lengthOf(entropy.toString('hex'), 64);
  });
});
