class Account {
  constructor(config) {
    this.title = config.title;
    this.index = config.index;
    this.previousAddresses = [];
    this.freshAddresses = config.freshAddresses;
    this.privateKeyWIF = config.privateKeyWIF;
    this.xpriv = config.xpriv;
    this.xpub = config.xpub;
    this.displayAccount = false;
    this.legacy = config.legacy;
    this.cashAddr = config.cashAddr;
  }
}

export default Account;
