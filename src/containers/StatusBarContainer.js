import { connect } from 'react-redux'
import StatusBar from '../components/StatusBar'
import {
  addBlock
} from '../actions/BlockchainActions';


const mapStateToProps = (state) => {
  return {
    wallet: state.wallet,
    configuration: state.configuration,
    blockchain: state.blockchain
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    addBlock: (chain) => {
      dispatch(addBlock(chain))
    }
  }
}

 
const StatusBarContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(StatusBar)
 
export default StatusBarContainer
