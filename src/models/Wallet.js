class Wallet {
  constructor(config) {
    this.entropy = config.entropy || 16;
    this.network = config.network || 'bitcoin';
    this.mnemonic = config.mnemonic || '';
    this.totalAccounts =  config.totalAccounts || 10;
    this.autogenerateMnemonic = config.autogeneratePath === false ? false : true;
    this.autogeneratePath = config.autogeneratePath === false ? false : true;
    this.path = config.path || '';
    this.displayCashaddr = config.displayCashaddr === false ? false : true;
    this.password = config.password || '';
    this.usePassword = config.usePassword || '';
    this.displayTestnet = config.displayTestnet === false ? false : true;
  }
}

export default Wallet;
