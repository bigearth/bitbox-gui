import {
  CREATE_WALLET,
  ADD_ROOT_SEED,
  ADD_MASTER_PRIVATE_KEY,
  CREATE_ACCOUNT,
  TOGGLE_DISPLAY_ACCOUNT
} from '../actions/WalletActions';

import Wallet from '../models/Wallet';
import Account from '../models/Account';

export default function wallet(state = {}, action) {
  let tmpState = state;
  switch (action.type) {
    case CREATE_WALLET:
      return Object.assign({}, state,  new Wallet())
    case ADD_ROOT_SEED:
      tmpState.rootSeed = action.rootSeed;
      return Object.assign({}, state, tmpState)
    case ADD_MASTER_PRIVATE_KEY:
      tmpState.masterPrivateKey = action.masterPrivateKey;
      return Object.assign({}, state, tmpState)
    case CREATE_ACCOUNT:
      tmpState.accounts.push(new Account(action.account));
      return Object.assign({}, state, tmpState)
    case TOGGLE_DISPLAY_ACCOUNT:
      tmpState.accounts.forEach((account) => {
        if(account.index === action.index) {
          account.toggleDisplayAccount = !account.toggleDisplayAccount;
        }
      })
      return Object.assign({}, state, tmpState)
    default:
      return state
  }
}
