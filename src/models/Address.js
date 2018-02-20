
class Address {
  constructor(config) {
    this.privateKeyWIF = config.privateKeyWIF;
    this.xpriv = config.xpriv;
    this.xpub = config.xpub;
  }
}

export default Address;
