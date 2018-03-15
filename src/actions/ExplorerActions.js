/*
 * action types
 */

export const CREATE_EXPLORER = 'CREATE_EXPLORER';
export const UPDATE_EXPLORER_VALUE = 'UPDATE_EXPLORER_VALUE';

/*
 * action creators
 */

export function createExplorer() {
 return { type: CREATE_EXPLORER }
}

export function updateExplorerValue(value) {
  return { type: UPDATE_EXPLORER_VALUE, value}
}
