import { connect } from 'react-redux'
import AccountSend from '../components/AccountSend'
// import {
//   createConvert,
//   updateValue
// } from '../actions/ConvertActions';

const mapStateToProps = (state) => {
  return {
    // wallet: state.wallet
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    // createConvert: () => {
    //   dispatch(createConvert())
    // },
    // updateValue: (prop, value) => {
    //   dispatch(updateValue(prop, value))
    // }
  }
}
 
const AccountSendContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(AccountSend)
 
export default AccountSendContainer
