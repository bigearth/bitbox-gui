import { connect } from 'react-redux'
import WalletConfiguration from '../components/WalletConfiguration'
import BitcoinCash from '../utilities/BitcoinCash';
import {
  toggleWalletConfig,
  updateWalletConfig,
  updateStore,
  setExchangeRate
} from '../actions/ConfigurationActions';

import {
  createBlockchain
} from '../actions/BlockchainActions';

import {
  resetWallet,
  createAccount
} from '../actions/WalletActions';

import {
  createMempool
} from '../actions/MempoolActions';

const mapStateToProps = (state) => {
  return {
    configuration: state.configuration
  }
}
 
const mapDispatchToProps = (dispatch) => {
  return {
    handleConfigToggle: (e) => {
      let prop = e.target.id;
      let checked = e.target.checked;

      dispatch(toggleWalletConfig(prop, checked))
    },
    handleConfigChange: (e) => {
      let prop = e.target.id;
      let value = e.target.value;
      dispatch(updateWalletConfig(prop, value))
      if(prop === 'exchangeCurrency') {
        dispatch(setExchangeRate());
      }
    },
    handleEntropySliderChange: (value) => {
      dispatch(updateWalletConfig('entropy', value))
    },
    resetBitbox: (configuration) => {
      configuration.mnemonic = configuration.newMnemonic;
      if(configuration.autogenerateHDMnemonic) {
        // create a random mnemonic w/ user provided entropy size
        let randomBytes = bitbox.Crypto.randomBytes(configuration.entropy);
        configuration.mnemonic = bitbox.Mnemonic.fromEntropy(randomBytes, bitbox.Mnemonic.wordLists()[configuration.language]);
      }

      let accounts = BitcoinCash.createAccounts(configuration);

      dispatch(resetWallet());
      dispatch(updateWalletConfig('mnemonic', configuration.mnemonic));
      dispatch(updateWalletConfig('HDPath', configuration.HDPath));
      dispatch(createBlockchain());
      dispatch(createMempool());
      dispatch(setExchangeRate());

      accounts.forEach((account, index) => {
        let xpriv = bitbox.HDNode.toXPriv(account);
        let xpub = bitbox.HDNode.toXPub(account);

        let formattedAccount = {
          addresses: account.addresses,
          title: '',
          index: index,
          privateKeyWIF:  bitbox.HDNode.toWIF(account),
          xpriv: xpriv,
          xpub: xpub
        };
        dispatch(createAccount(formattedAccount));
      });
      dispatch(updateStore());
    }
  }
}
 
const WalletConfigurationContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(WalletConfiguration)
 
export default WalletConfigurationContainer
