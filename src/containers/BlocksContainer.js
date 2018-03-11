import { connect } from 'react-redux'
import Blocks from '../components/Blocks'

const mapStateToProps = (state) => {
  return {
    configuration: state.configuration.wallet,
    blockchain: state.blockchain
  }
}
 
const BlocksContainer = connect(
  mapStateToProps
)(Blocks)
 
export default BlocksContainer
