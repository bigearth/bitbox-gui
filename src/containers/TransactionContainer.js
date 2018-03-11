import { connect } from 'react-redux'
import Transaction from '../components/Transaction'

const mapStateToProps = (state) => {
  return {
    configuration: state.configuration,
    blockchain: state.blockchain
  }
}
 
const TransactionContainer = connect(
  mapStateToProps
)(Transaction)
 
export default TransactionContainer
