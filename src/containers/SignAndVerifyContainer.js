import { connect } from 'react-redux'
import SignAndVerify from '../components/SignAndVerify'

import {
  updateValue
} from '../actions/ConvertActions';

const mapStateToProps = state => {
  return {
    wallet: state.wallet,
    signAndVerify: state.signandverify
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    updateValue: (prop, value) => {
      dispatch(updateValue(prop, value))
    }
  }
}
 
const SignAndVerifyContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(SignAndVerify)
 
export default SignAndVerifyContainer
