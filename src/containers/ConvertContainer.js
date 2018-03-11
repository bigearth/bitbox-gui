import { connect } from 'react-redux'
import Convert from '../components/Convert'
import {
  createConvert,
  updateValue
} from '../actions/ConvertActions';

const mapStateToProps = (state) => {
  return {
    configuration: state.configuration.wallet,
    convert: state.convert
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    createConvert: () => {
      dispatch(createConvert())
    },
    updateValue: (prop, value) => {
      dispatch(updateValue(prop, value))
    }
  }
}
 
const ConvertContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(Convert)
 
export default ConvertContainer
