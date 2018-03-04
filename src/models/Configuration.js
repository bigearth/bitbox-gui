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
      HDPath: {
        masterKey: "m",
        purpose: "44'",
        coinCode: "145'",
        account: "0'",
        change: "0",
        address_index: "0"
      },
      password: ''
    };
  }
}

export default Configuration;
