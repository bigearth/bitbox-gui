import { connect } from 'react-redux'
import AccountSend from '../components/AccountSend'
import {
  updateAccountSendValue
} from '../actions/AccountSendActions';

import {
  addTx
} from '../actions/MempoolActions';


const mapStateToProps = (state) => {
  return {
    configuration: state.configuration.wallet,
    wallet: state.wallet,
    accountSend: state.accountsend
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    updateAccountSendValue: (prop, value) => {
      dispatch(updateAccountSendValue(prop, value))
    },
    addTx: (tx) => {
      dispatch(addTx(tx))
    }
  }
}
 
const AccountSendContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(AccountSend)
 
export default AccountSendContainer
