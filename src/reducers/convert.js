import {
  CREATE_CONVERT,
  UPDATE_VALUE
} from '../actions/ConvertActions';
import Convert from '../models/Convert';

export default function convert(state = {}, action) {
  let convertConfig = state;
  switch (action.type) {
    case CREATE_CONVERT:
      convertConfig = new Convert();
      return Object.assign({}, state, convertConfig)
    case UPDATE_VALUE:
      convertConfig[action.prop] = action.value;
      return Object.assign({}, state, convertConfig)
    default:
      return state
  }
}
