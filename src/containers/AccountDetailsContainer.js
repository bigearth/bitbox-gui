import { connect } from 'react-redux'
import AccountDetails from '../components/AccountDetails'

const mapStateToProps = (state) => {
  return {
    configuration: state.configuration.wallet,
    wallet: state.wallet
  }
}

const AccountDetailsContainer = connect(
  mapStateToProps
)(AccountDetails)
 
export default AccountDetailsContainer
