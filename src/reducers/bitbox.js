import { combineReducers } from 'redux'

import configuration from './configuration';
import wallet from './wallet';
import importAndExport from './importAndExport';
import convert from './convert';
 
const bitbox = combineReducers({
  configuration,
  wallet,
  importAndExport,
  convert
})

const rootReducer = (state, action) => {
  if (action.type === 'IMPORT_STORE') {
    state = JSON.parse(action.store)
    state.importAndExport.importState = true;
    state.importAndExport.activePane = 'import';
  } else if(action.type === 'UPDATE_STORE') {
    store.set('state', state);
  }

  return bitbox(state, action)
}
 
export default rootReducer
