import { combineReducers } from 'redux'

import configuration from './configuration';
import wallet from './wallet';
import importAndExport from './importAndExport';
 
const bitbox = combineReducers({
  configuration,
  wallet,
  importAndExport
})

const rootReducer = (state, action) => {
  if (action.type === 'IMPORT_STORE') {
    state = JSON.parse(action.store)
    state.importAndExport.importState = true;
    state.importAndExport.activePane = 'import';
  }
  return bitbox(state, action)
}
 
export default rootReducer
