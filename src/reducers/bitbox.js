import { combineReducers } from 'redux'

import configuration from './configuration';
import wallet from './wallet';
import importAndExport from './importAndExport';
import convert from './convert';
import blockchain from './blockchain';
import signandverify from './signandverify';
import explorer from './explorer';
import accountsend from './accountsend';
import mempool from './mempool';
 
const bitboxReducer = combineReducers({
  configuration,
  wallet,
  importAndExport,
  convert,
  blockchain,
  signandverify,
  explorer,
  accountsend,
  mempool
})

const rootReducer = (state, action) => {
  if (action.type === 'IMPORT_STORE') {
    state = action.store;
    state.importAndExport.importState = true;
    state.importAndExport.activePane = 'import';
  } else if(action.type === 'UPDATE_STORE') {
    store.set('state', state);
  }

  return bitboxReducer(state, action)
}
 
export default rootReducer
