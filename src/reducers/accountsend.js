import {
  CREATE_ACCOUNT_SEND,
  UPDATE_ACCOUNT_SEND_VALUE
} from '../actions/AccountSendActions';

import AccountSend from '../models/AccountSend';

export default function accountsend(state = {}, action) {
  let accountsendConfig = state;

  switch (action.type) {
    case CREATE_ACCOUNT_SEND:
      return Object.assign({}, state, new AccountSend())
    case UPDATE_ACCOUNT_SEND_VALUE:
      accountsendConfig[action.prop] = action.value;
      return Object.assign({}, state, accountsendConfig)
    default:
      return state
  }
}
