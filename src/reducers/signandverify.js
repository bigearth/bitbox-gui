import {
  CREATE_SIGN_AND_VERIFY,
  UPDATE_SIGN_AND_VERIFY_VALUE
} from '../actions/SignAndVerifyActions';
import SignAndVerify from '../models/SignAndVerify';

export default function signandverify(state = {}, action) {
  let signAndVerifyConfig = state;
  switch (action.type) {
    case CREATE_SIGN_AND_VERIFY:
      signAndVerifyConfig = new SignAndVerify();
      return Object.assign({}, state, signAndVerifyConfig)
    case UPDATE_SIGN_AND_VERIFY_VALUE:
      signAndVerifyConfig[action.prop] = action.value;
      return Object.assign({}, state, signAndVerifyConfig)
    default:
      return state
  }
}
