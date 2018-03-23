import { connect } from 'react-redux'
import Address from '../components/Address'

const mapStateToProps = (state) => {
  return {
    configuration: state.configuration.wallet
  }
}

const AddressContainer = connect(
  mapStateToProps
)(Address)
 
export default AddressContainer
