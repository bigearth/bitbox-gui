/*
 * action types
 */

export const CREATE_SIGN_AND_VERIFY = 'CREATE_SIGN_AND_VERIFY';
export const UPDATE_VALUE = 'UPDATE_VALUE';
 
/*
 * action creators
 */

export function createSignAndVerify() {
  return { type: CREATE_SIGN_AND_VERIFY }
}

export function updateValue(prop, value) {
  return { type: UPDATE_VALUE, prop, value}
}
