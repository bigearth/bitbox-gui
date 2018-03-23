import { createStore } from 'redux'
import bitboxReducer from '../reducers/bitbox'

let reduxStore = createStore(bitboxReducer);
export default reduxStore;
