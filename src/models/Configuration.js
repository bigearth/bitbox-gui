class Configuration {
  constructor() {
    this.wallet = {
      autogenerateHDMnemonic: true,
      autogenerateHDPath: true,
      displayCashaddr: true,
      displayTestnet: false,
      usePassword: false,
      entropy: null,
      network: '',
      mnemonic: '',
      totalAccounts: 0,
      HDPath: '',
      password: ''
    };
  }
}

export default Configuration;
