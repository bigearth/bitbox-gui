class Account {
  constructor(config) {
    this.addresses = config.addresses;
    this.title = config.title;
    this.index = config.index;
    this.privateKeyWIF = config.privateKeyWIF;
    this.xpriv = config.xpriv;
    this.xpub = config.xpub;
    this.displayAccount = false;
  }
}

export default Account;
