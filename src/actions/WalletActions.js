/*
 * action types
 */

export const RESET_WALLET = 'RESET_WALLET';
export const CREATE_WALLET = 'CREATE_WALLET';
export const CREATE_ACCOUNT = 'CREATE_ACCOUNT';
export const TOGGLE_DISPLAY_ACCOUNT = 'TOGGLE_DISPLAY_ACCOUNT';
export const UPDATE_ACCOUNT = 'UPDATE_ACCOUNT';

/*
 * action creators
 */

export function resetWallet() {
 return { type: RESET_WALLET }
}

export function createWallet() {
 return { type: CREATE_WALLET }
}

export function createAccount(account) {
  return { type: CREATE_ACCOUNT, account }
}

export function toggleDisplayAccount(account) {
  return { type: TOGGLE_DISPLAY_ACCOUNT, account }
}

export function updateAccount(account) {
  return { type: UPDATE_ACCOUNT, account }
}
