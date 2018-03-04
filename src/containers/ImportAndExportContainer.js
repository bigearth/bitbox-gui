import { connect } from 'react-redux'
import ImportAndExport from '../components/ImportAndExport';
import {
  toggleVisibility,
  toggleExportCopied,
  importStore
} from '../actions/ImportAndExportActions';

const mapStateToProps = state => {
  return {
    state: state
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    toggleVisibility: () => {
      dispatch(toggleExportCopied(false));
      dispatch(toggleVisibility());
    },
    toggleExportCopied: (val) => {
      dispatch(toggleExportCopied(val));
    },
    importStore: (store) => {
      dispatch(importStore(store));
    }
  }
}
 
const ImportAndExportContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(ImportAndExport)
 
export default ImportAndExportContainer
