/*
 * action types
 */

export const CREATE_CONVERT = 'CREATE_CONVERT';
export const UPDATE_VALUE = 'UPDATE_VALUE';
 
/*
 * action creators
 */

export function createConvert() {
  return { type: CREATE_CONVERT }
}

export function updateValue(prop, value) {
  return { type: UPDATE_VALUE, prop, value}
}
