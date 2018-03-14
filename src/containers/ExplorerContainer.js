import { connect } from 'react-redux'
import Explorer from '../components/Explorer'
import {
  withRouter
} from 'react-router-dom';

import {
  updateValue
} from '../actions/ExplorerActions';

const mapStateToProps = (state) => {
  return {
    configuration: state.configuration.wallet,
    blockchain: state.blockchain,
    wallet: state.wallet,
    explorer: state.explorer
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    resetValue: () => {
      dispatch(updateValue(''))
    },
    updateValue: (e) => {
      dispatch(updateValue(e.target.value))
    }
  }
}
 
const ExplorerContainer = withRouter(connect(
  mapStateToProps,
  mapDispatchToProps
)(Explorer))
 
export default ExplorerContainer
