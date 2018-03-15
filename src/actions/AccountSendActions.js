/*
 * action types
 */

export const CREATE_ACCOUNT_SEND = 'CREATE_ACCOUNT_SEND';
export const UPDATE_ACCOUNT_SEND_VALUE = 'UPDATE_ACCOUNT_SEND_VALUE';
 
/*
 * action creators
 */

export function createAccountSend() {
  return { type: CREATE_ACCOUNT_SEND }
}

export function updateAccountSendValue(prop, value) {
  return { type: UPDATE_ACCOUNT_SEND_VALUE, prop, value}
}
