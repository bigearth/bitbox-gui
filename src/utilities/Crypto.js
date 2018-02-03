import crypto from 'crypto';

class Crypto {
  // Utility class to wrap NodeJS's crypto module
  // https://nodejs.org/api/crypto.html
  static createSHA256Hash(data, type = 'sha256') {
    return crypto.createHash(type).update(data).digest().toString('hex');
  }

  static createRIPEMD160Hash(data, type = 'ripemd160') {
    return crypto.createHash(type).update(data).digest().toString('hex');
  }

  static randomBytes(size = 16) {
    return crypto.randomBytes(16).toString('hex');
  }
}

export default Crypto;
