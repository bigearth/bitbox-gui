import { connect } from 'react-redux'
import Blocks from '../components/Blocks'

const mapStateToProps = (state) => {
  return {
    blockchain: state.blockchain
  }
}
 
const BlocksContainer = connect(
  mapStateToProps
)(Blocks)
 
export default BlocksContainer
