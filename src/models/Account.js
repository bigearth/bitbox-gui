class Account {
  constructor(config) {
    this.title = config.title;
    this.index = config.index;
    this.privateKeyWIF = config.privateKeyWIF;
    this.xpriv = config.xpriv;
    this.xpub = config.xpub;
    this.toggleDisplayAccount = false;
  }
}

export default Account;
