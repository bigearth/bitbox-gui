/*
 * action types
 */

export const CREATE_UTXO = 'CREATE_UTXO';
export const ADD_UTXO = 'ADD_UTXO';
export const REMOVE_UTXO = 'REMOVE_UTXO';

/*
 * action creators
 */

export function createUtxo() {
 return { type: CREATE_UTXO }
}

export function addUtxo(utxo) {
 return { type: ADD_UTXO, utxo }
}

export function removeUtxo(utxo) {
 return { type: REMOVE_UTXO, utxo }
}
