import { connect } from 'react-redux'
import ImportAndExport from '../components/ImportAndExport';
import {
  createImportAndExport,
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
    createImportAndExport: (configuration) => {
      dispatch(createImportAndExport());
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
