import {
  CREATE_IMPORT_AND_EXPORT,
  TOGGLE_VISIBILITY,
  TOGGLE_EXPORT_COPIED
} from '../actions/ImportAndExportActions';
import ImportAndExport from '../models/ImportAndExport';

export default function importAndExport(state = {}, action) {
  let importAndExportConfig = state;
  switch (action.type) {
    case CREATE_IMPORT_AND_EXPORT:
      importAndExportConfig = new ImportAndExport();
      return Object.assign({}, state, importAndExportConfig)
    case TOGGLE_VISIBILITY:
      importAndExportConfig.visible = !importAndExportConfig.visible;
      importAndExportConfig.activePane = action.activePane;
      importAndExportConfig.importState = false;
      return Object.assign({}, state, importAndExportConfig)
    case TOGGLE_EXPORT_COPIED:
      importAndExportConfig.exportCopied = action.value;
      return Object.assign({}, state, importAndExportConfig)
    default:
      return state
  }
}
