import {
  CREATE_UTXO,
  ADD_UTXO,
  REMOVE_UTXO
} from '../actions/UtxoActions';

import Utxo from '../models/Utxo';

export default function utxo(state = {}, action) {
  let utxoState = state;
  switch (action.type) {
    case CREATE_UTXO:
      return Object.assign({}, state, new Utxo())
    case ADD_UTXO:
      utxoState.outputs.push(action.utxo);
      return Object.assign({}, state, utxoState)
    case REMOVE_UTXO:
      // TODO remove
      utxoState.outputs.push(action.utxo);
      return Object.assign({}, state, utxoState)
    default:
      return state
  }
}
