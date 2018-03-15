/*
 * action types
 */

export const CREATE_CONVERT = 'CREATE_CONVERT';
export const UPDATE_CONVERT_VALUE = 'UPDATE_CONVERT_VALUE';
 
/*
 * action creators
 */

export function createConvert() {
  return { type: CREATE_CONVERT }
}

export function updateConvertValue(prop, value) {
  return { type: UPDATE_CONVERT_VALUE, prop, value}
}
