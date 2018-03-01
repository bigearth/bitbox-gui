/*
 * action types
 */

export const CREATE_CONFIG = 'CREATE_CONFIG';
export const TOGGLE_WALLET_CONFIG = 'TOGGLE_WALLET_CONFIG';
export const UPDATE_WALLET_CONFIG = 'UPDATE_WALLET_CONFIG';
 
/*
 * action creators
 */

export function createConfig() {
  return { type: CREATE_CONFIG }
}

export function toggleWalletConfig(toggle, prop) {
  return { type: TOGGLE_WALLET_CONFIG, toggle, prop }
}

export function updateWalletConfig(update, prop) {
  return { type: UPDATE_WALLET_CONFIG, update, prop }
}
