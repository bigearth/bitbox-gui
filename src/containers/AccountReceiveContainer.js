import { connect } from 'react-redux'
import AccountReceive from '../components/AccountReceive'

const mapStateToProps = (state) => {
  return {
    configuration: state.configuration.wallet,
    wallet: state.wallet
  }
}

const AccountReceiveContainer = connect(
  mapStateToProps
)(AccountReceive)
 
export default AccountReceiveContainer
