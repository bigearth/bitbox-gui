import { connect } from 'react-redux'
import AccountDetails from '../components/AccountDetails'
import {
  createConvert,
  updateValue
} from '../actions/ConvertActions';

const mapStateToProps = (state) => {
  return {
    configuration: state.configuration.wallet,
    wallet: state.wallet
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    createConvert: () => {
      dispatch(createConvert())
    },
    updateValue: (prop, value) => {
      dispatch(updateValue(prop, value))
    }
  }
}
 
const AccountDetailsContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(AccountDetails)
 
export default AccountDetailsContainer
