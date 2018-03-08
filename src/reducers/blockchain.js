import {
  CREATE_BLOCKCHAIN,
  ADD_BLOCK
} from '../actions/BlockchainActions';
import Blockchain from '../models/Blockchain';

export default function convert(state = {}, action) {
  let blockchainConfig = state;
  switch (action.type) {
    case CREATE_BLOCKCHAIN:
      blockchainConfig = new Blockchain();
      return Object.assign({}, state, blockchainConfig)
    case ADD_BLOCK:
      blockchainConfig.chain.push(action.block);
      return Object.assign({}, state, blockchainConfig)
    default:
      return state
  }
}
