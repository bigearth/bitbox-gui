/*
 * action types
 */

export const CREATE_EXPLORER = 'CREATE_EXPLORER';
export const UPDATE_VALUE = 'UPDATE_VALUE';

/*
 * action creators
 */

export function createExplorer() {
 return { type: CREATE_EXPLORER }
}

export function updateValue(value) {
  return { type: UPDATE_VALUE, value}
}
