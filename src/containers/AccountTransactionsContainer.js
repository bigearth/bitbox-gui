import { connect } from 'react-redux'
import AccountTransactions from '../components/AccountTransactions'
// import {
//   createConvert,
//   updateValue
// } from '../actions/ConvertActions';

const mapStateToProps = (state) => {
  return {
    wallet: state.wallet
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
 
const AccountTransactionsContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(AccountTransactions)
 
export default AccountTransactionsContainer
