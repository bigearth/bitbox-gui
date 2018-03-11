import { connect } from 'react-redux'
import BlockDetails from '../components/BlockDetails'

const mapStateToProps = (state) => {
  return {
    configuration: state.configuration.wallet,
    blockchain: state.blockchain
  }
}
 
const BlockContainer = connect(
  mapStateToProps
)(BlockDetails)
 
export default BlockContainer
