import { connect } from 'react-redux'
import Wallet from '../components/Wallet'
import {
  addRootSeed,
  addMasterPrivateKey,
  createAccount,
  toggleDisplayAccount
} from '../actions/WalletActions';

const mapStateToProps = state => {
  return {
    config: state.configuration
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    showKey: (e) => {
      // showKey(address, privateKeyWIF, xpriv, xpub) {
      // let prop = e.target.id;
      // let checked = e.target.checked;

      dispatch(toggleWalletConfig(prop, checked))
    },
    hideKey: (e) => {
      // let prop = e.target.id;
      // let value = e.target.value;
      dispatch(updateWalletConfig(prop, value))
    },
    handleEntropySliderChange: (value) => {
      dispatch(updateWalletConfig('entropy', value))
    }
  }
}
 
const WalletContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(Wallet)
 
export default WalletConfigurationContainer
