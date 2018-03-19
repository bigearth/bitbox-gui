import { connect } from 'react-redux'
import WalletConfiguration from '../components/WalletConfiguration'
import BitcoinCash from '../utilities/BitcoinCash';
import {
  toggleWalletConfig,
  updateWalletConfig,
  updateStore
} from '../actions/ConfigurationActions';

import {
  createBlockchain
} from '../actions/BlockchainActions';

import {
  resetWallet,
  createAccount
} from '../actions/WalletActions';

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
    },
    handleEntropySliderChange: (value) => {
      dispatch(updateWalletConfig('entropy', value))
    },
    resetBitbox: (configuration) => {
      configuration.mnemonic = configuration.newMnemonic;
      if(configuration.autogenerateHDMnemonic) {
        // create a random mnemonic w/ user provided entropy size
        let randomBytes = bitbox.Crypto.randomBytes(configuration.entropy);
        configuration.mnemonic = bitbox.BitcoinCash.Mnemonic.entropyToMnemonic(randomBytes, bitbox.BitcoinCash.Mnemonic.mnemonicWordLists()[configuration.language]);
      }

      let accounts = BitcoinCash.createAccounts(configuration);

      dispatch(resetWallet());
      dispatch(updateWalletConfig('mnemonic', configuration.mnemonic));
      dispatch(updateWalletConfig('HDPath', configuration.HDPath));
      dispatch(createBlockchain());

      accounts.forEach((account, index) => {

        let xpriv = bitbox.BitcoinCash.HDNode.toXPriv(account);
        let xpub = bitbox.BitcoinCash.HDNode.toXPub(account);
        
        dispatch(createAccount({
          title: '',
          index: index,
          privateKeyWIF: bitbox.BitcoinCash.HDNode.getPrivateKeyWIF(account),
          xpriv: xpriv,
          xpub: xpub
        }))
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
