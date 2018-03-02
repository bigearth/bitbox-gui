import { connect } from 'react-redux'
import SignAndVerify from '../components/SignAndVerify'

const mapStateToProps = state => {
  return {
    wallet: state.wallet
  }
}
 
const SignAndVerifyContainer = connect(
  mapStateToProps
)(SignAndVerify)
 
export default SignAndVerifyContainer
