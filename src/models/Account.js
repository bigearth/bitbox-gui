class Account {
  constructor(config) {
    this.addresses = config.addresses;
    this.title = config.title;
    this.index = config.index;
    this.privateKeyWIF = config.privateKeyWIF;
    this.xpriv = config.xpriv;
    this.xpub = config.xpub;
    this.displayAccount = false;
    this.balance = 0;
    this.txCount = 0;
    this.sent = 0;
    this.received = 0;
    this.transactions = [];
  }
}

export default Account;
