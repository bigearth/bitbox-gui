import { connect } from 'react-redux'
import AccountReceive from '../components/AccountReceive'

import {
  updateAccount
} from '../actions/WalletActions';

const mapStateToProps = (state) => {
  return {
    configuration: state.configuration.wallet,
    wallet: state.wallet
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    updateAccount: (account) => {
      dispatch(updateAccount(account))
    }
  }
}
 
const AccountReceiveContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(AccountReceive)
 
export default AccountReceiveContainer
