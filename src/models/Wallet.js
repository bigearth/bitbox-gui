class Wallet {
  constructor(config) {
    this.entropy = config.entropy || 16;
    this.network = config.network || 'bitcoin';
    this.mnemonic = config.mnemonic || '';
    this.totalAccounts =  config.totalAccounts || 10;
    this.autogenerateMnemonic = config.autogenerateMnemonic || true;
    this.autogeneratePath = config.autogeneratePath || true;
    this.path = config.path || '';
    this.displayCashaddr = config.displayCashaddr || true;
    this.password = config.password || '';
    this.usePassword = config.usePassword || '';
  }
}

export default Wallet;
