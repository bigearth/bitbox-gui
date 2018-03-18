import {
  CREATE_WALLET,
  RESET_WALLET,
  CREATE_ACCOUNT,
  TOGGLE_DISPLAY_ACCOUNT,
  UPDATE_ACCOUNT
} from '../actions/WalletActions';

import Wallet from '../models/Wallet';
import Account from '../models/Account';

export default function wallet(state = {}, action) {
  let tmpState = state;
  switch (action.type) {
    case CREATE_WALLET:
      return Object.assign({}, state, new Wallet())
    case RESET_WALLET:
      return Object.assign({}, state, new Wallet())
    case CREATE_ACCOUNT:
      tmpState.accounts.push(new Account(action.account));
      return Object.assign({}, state, tmpState)
    case TOGGLE_DISPLAY_ACCOUNT:
      tmpState.accounts.forEach((account) => {
        if(account.index === action.account.index) {
          account.displayAccount = !account.displayAccount;
        }
      })
    case UPDATE_ACCOUNT:
      tmpState.accounts.forEach((account) => {
        if(account.index === action.account.index) {
          account = action.account;
        }
      })
      return Object.assign({}, state, tmpState)
    default:
      return state
  }
}
