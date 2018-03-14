import { connect } from 'react-redux'
import AccountReceive from '../components/AccountReceive'
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
 
const AccountReceiveContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(AccountReceive)
 
export default AccountReceiveContainer
