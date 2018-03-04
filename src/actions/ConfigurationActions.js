/*
 * action types
 */

export const CREATE_CONFIG = 'CREATE_CONFIG';
export const TOGGLE_WALLET_CONFIG = 'TOGGLE_WALLET_CONFIG';
export const UPDATE_WALLET_CONFIG = 'UPDATE_WALLET_CONFIG';
export const UPDATE_STORE = 'UPDATE_STORE';
 
/*
 * action creators
 */

export function createConfig() {
  return { type: CREATE_CONFIG }
}

export function toggleWalletConfig(prop, checked) {
  return { type: TOGGLE_WALLET_CONFIG, prop, checked }
}

export function updateWalletConfig(prop, value) {
  return { type: UPDATE_WALLET_CONFIG, prop, value }
}

export function updateStore() {
  return { type: UPDATE_STORE }
}
