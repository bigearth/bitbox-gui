import { connect } from 'react-redux'
import SignAndVerify from '../components/SignAndVerify'

import {
  updateSignAndVerifyValue
} from '../actions/SignAndVerifyActions';

const mapStateToProps = state => {
  return {
    wallet: state.wallet,
    signAndVerify: state.signandverify
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    updateSignAndVerifyValue: (prop, value) => {
      dispatch(updateSignAndVerifyValue(prop, value))
    }
  }
}
 
const SignAndVerifyContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(SignAndVerify)
 
export default SignAndVerifyContainer
