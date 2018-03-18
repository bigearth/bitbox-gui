import { connect } from 'react-redux'
import Wallet from '../components/Wallet'
import {
  createAccount,
  toggleDisplayAccount
} from '../actions/WalletActions';

const mapStateToProps = state => {
  return {
    wallet: state.wallet,
    configuration: state.configuration.wallet
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    toggleDisplayAccount: (account) => {
      dispatch(toggleDisplayAccount(account))
    }
  }
}
 
const WalletContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(Wallet)
 
export default WalletContainer
