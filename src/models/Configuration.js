class Configuration {
  constructor() {
    this.wallet = {
      autogenerateHDMnemonic: true,
      autogenerateHDPath: true,
      displayCashaddr: true,
      displayTestnet: false,
      usePassword: false,
      entropy: 16,
      network: 'bitcoin',
      mnemonic: '',
      totalAccounts: 10,
      HDPath: "m/44'/145'/0'/0/0",
      password: ''
    };
  }
}

export default Configuration;
