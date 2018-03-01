import {
  CREATE_CONFIG,
  TOGGLE_WALLET_CONFIG,
  UPDATE_WALLET_CONFIG
} from '../actions/ConfigurationActions';
import Configuration from '../models/Configuration';

export default function configuration(state = {}, action) {
  let walletConfig;
  switch (action.type) {
    case CREATE_CONFIG:
      walletConfig = new Configuration();
      return Object.assign({}, state, walletConfig)
    case TOGGLE_WALLET_CONFIG:
      walletConfig = state;

      walletConfig.wallet[action.prop] = action.checked;
      return Object.assign({}, state, walletConfig)
    case UPDATE_WALLET_CONFIG:
      walletConfig = state;

      if(isNaN(action.value) === false) {
        action.value = +action.value;
      }
      walletConfig.wallet[action.prop] = action.value;
      return Object.assign({}, state, walletConfig)
    default:
      return state
  }
}
