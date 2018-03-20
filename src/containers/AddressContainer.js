import { connect } from 'react-redux'
import Address from '../components/Address'
// import {
//   createAddress,
//   updateAddressValue
// } from '../actions/AddressActions';

const mapStateToProps = (state) => {
  return {
    configuration: state.configuration.wallet,
    convert: state.convert
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    // createAddress: () => {
    //   dispatch(createAddress())
    // },
    // updateAddressValue: (prop, value) => {
    //   dispatch(updateAddressValue(prop, value))
    // }
  }
}
 
  const AddressContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(Address)
 
export default AddressContainer
