import {
  CREATE_EXPLORER,
  UPDATE_EXPLORER_VALUE
} from '../actions/ExplorerActions';

import Explorer from '../models/Explorer';

export default function wallet(state = {}, action) {
  switch (action.type) {
    case CREATE_EXPLORER:
      return Object.assign({}, state, new Explorer())
    case UPDATE_EXPLORER_VALUE:
      return Object.assign({}, state, {
        searchTerm: action.value
      })
    default:
      return state
  }
}
