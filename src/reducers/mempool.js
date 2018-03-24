import {
  CREATE_MEMPOOL,
  ADD_TX,
  EMPTY_MEMPOOL
} from '../actions/MempoolActions';

import Mempool from '../models/Mempool';

export default function wallet(state = {}, action) {
  switch (action.type) {
    case CREATE_MEMPOOL:
      return Object.assign({}, state, new Mempool());
    case ADD_TX:
      let mempoolConfig = state;
      mempoolConfig.transactions.push(action.tx)
      return Object.assign({}, state, mempoolConfig);
    case EMPTY_MEMPOOL:
      return Object.assign({}, state,  new Mempool());
    default:
      return state
  }
}
