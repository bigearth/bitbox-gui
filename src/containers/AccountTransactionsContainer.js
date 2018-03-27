import { connect } from 'react-redux'
import AccountTransactions from '../components/AccountTransactions'

const mapStateToProps = (state) => {
  return {
    configuration: state.configuration.wallet,
    blockchain: state.blockchain,
    wallet: state.wallet
  }
}

const AccountTransactionsContainer = connect(
  mapStateToProps
)(AccountTransactions)
 
export default AccountTransactionsContainer
