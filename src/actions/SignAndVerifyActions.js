/*
 * action types
 */

export const CREATE_SIGN_AND_VERIFY = 'CREATE_SIGN_AND_VERIFY';
export const UPDATE_SIGN_AND_VERIFY_VALUE = 'UPDATE_SIGN_AND_VERIFY_VALUE';
 
/*
 * action creators
 */

export function createSignAndVerify() {
  return { type: CREATE_SIGN_AND_VERIFY }
}

export function updateSignAndVerifyValue(prop, value) {
  return { type: UPDATE_SIGN_AND_VERIFY_VALUE, prop, value}
}
