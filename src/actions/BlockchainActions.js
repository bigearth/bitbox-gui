/*
 * action types
 */

export const CREATE_BLOCKCHAIN = 'CREATE_BLOCKCHAIN';
export const ADD_BLOCK = 'ADD_BLOCK';
 
/*
 * action creators
 */

export function createBlockchain() {
  return { type: CREATE_BLOCKCHAIN }
}

export function addBlock(chain) {
  return { type: ADD_BLOCK, chain}
}
