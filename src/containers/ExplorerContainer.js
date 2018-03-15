import { connect } from 'react-redux'
import Explorer from '../components/Explorer'
import {
  withRouter
} from 'react-router-dom';

import {
  updateExplorerValue
} from '../actions/ExplorerActions';

const mapStateToProps = (state) => {
  return {
    blockchain: state.blockchain,
    wallet: state.wallet,
    explorer: state.explorer
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    resetValue: () => {
      dispatch(updateExplorerValue(''))
    },
    updateExplorerValue: (e) => {
      dispatch(updateExplorerValue(e.target.value))
    }
  }
}
 
const ExplorerContainer = withRouter(connect(
  mapStateToProps,
  mapDispatchToProps
)(Explorer))
 
export default ExplorerContainer
