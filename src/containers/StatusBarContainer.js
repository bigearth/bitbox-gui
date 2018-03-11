import { connect } from 'react-redux'
import StatusBar from '../components/StatusBar'

const mapStateToProps = (state) => {
  return {
    blockchain: state.blockchain
  }
}

 
const StatusBarContainer = connect(
  mapStateToProps
)(StatusBar)
 
export default StatusBarContainer
