import { connect } from 'react-redux'
import WalletConfiguration from '../components/WalletConfiguration'
import BitcoinCash from '../utilities/BitcoinCash';
import {
  toggleWalletConfig,
  updateWalletConfig,
  updateStore
} from '../actions/ConfigurationActions';

import {
  resetWallet,
  addRootSeed,
  addMasterPrivateKey,
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
      let [rootSeed, masterPrivateKey, mnemonic, HDPath, accounts] = bitbox.BitcoinCash.createHDWallet(configuration);

      dispatch(resetWallet());
      dispatch(addRootSeed(rootSeed));
      dispatch(addMasterPrivateKey(masterPrivateKey.chainCode));
      dispatch(updateWalletConfig('mnemonic', mnemonic));
      dispatch(updateWalletConfig('HDPath', HDPath));

      accounts.forEach((account, index) => {

        let address = bitbox.BitcoinCash.fromWIF(account.privateKeyWIF, configuration.network).getAddress();

        dispatch(createAccount({
          title: account.title,
          index: account.index,
          privateKeyWIF: account.privateKeyWIF,
          xpriv: account.xpriv,
          xpub: account.xpub,
          legacy: address,
          cashAddr: bitbox.BitcoinCash.toCashAddress(address)
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
