import { connect } from 'react-redux'
import Convert from '../components/Convert'
import {
  createConvert,
  updateConvertValue
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
    updateConvertValue: (prop, value) => {
      dispatch(updateConvertValue(prop, value))
    }
  }
}
 
const ConvertContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(Convert)
 
export default ConvertContainer
