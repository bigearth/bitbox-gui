import {
  CREATE_CONVERT,
  UPDATE_CONVERT_VALUE
} from '../actions/ConvertActions';
import Convert from '../models/Convert';

export default function convert(state = {}, action) {
  let convertConfig = state;
  switch (action.type) {
    case CREATE_CONVERT:
      return Object.assign({}, state, new Convert())
    case UPDATE_CONVERT_VALUE:
      convertConfig[action.prop] = action.value;
      return Object.assign({}, state, convertConfig)
    default:
      return state
  }
}
