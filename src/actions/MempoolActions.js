/*
 * action types
 */

export const CREATE_MEMPOOL = 'CREATE_MEMPOOL';
export const ADD_TX = 'ADD_TX';
export const EMPTY_MEMPOOL = 'EMPTY_MEMPOOL';

/*
 * action creators
 */

export function createMempool() {
 return { type: CREATE_MEMPOOL }
}

export function addTx(tx) {
 return { type: ADD_TX, tx }
}

export function emptyMempool() {
 return { type: EMPTY_MEMPOOL }
}
