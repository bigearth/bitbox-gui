import { combineReducers } from 'redux'

import configuration from './configuration';
import wallet from './wallet';
 
const bitbox = combineReducers({
  configuration,
  wallet
})
 
export default bitbox
