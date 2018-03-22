import axios from 'axios';

import {
  CREATE_CONFIG,
  TOGGLE_WALLET_CONFIG,
  UPDATE_WALLET_CONFIG,
  SET_EXCHANGE_RATE
} from '../actions/ConfigurationActions';
import Configuration from '../models/Configuration';

export default function configuration(state = {}, action) {
  let config;
  switch (action.type) {
    case CREATE_CONFIG:
      return Object.assign({}, state, new Configuration())
    case TOGGLE_WALLET_CONFIG:
      config = state;
      if(action.prop === 'autogenerateHDPath' && action.checked) {
        config.wallet.HDPath = {
          masterKey: "m",
          purpose: "44'",
          coinCode: "145'",
          account: "0'",
          change: "0",
          address_index: "0"
        };
      }

      if(action.prop === 'usePassword' && !action.checked) {
        config.wallet.password = "";
      }

      if(action.prop === 'displayTestnet' && action.checked) {
        config.wallet.network = 'testnet';
      } else if(action.prop === 'displayTestnet' && !action.checked) {
        config.wallet.network = 'bitcoin';
      }

      config.wallet[action.prop] = action.checked;
      return Object.assign({}, state, config)
    case UPDATE_WALLET_CONFIG:
      config = state;

      if(isNaN(action.value) === false) {
        action.value = +action.value;
      }
      if(action.prop === 'HDPath' && !action.value.coinCode) {
        let val = action.value.split('/');
        action.value = {
          masterKey: val.shift(),
          purpose: val.shift(),
          coinCode: val.join('/'),
          account: "0'",
          change: "0",
          address_index: "0"
        };
      }

      config.wallet[action.prop] = action.value;
      return Object.assign({}, state, config)
    case SET_EXCHANGE_RATE:
      config = state;
      axios.get(`https://api.coinmarketcap.com/v1/ticker/bitcoin-cash/?convert=${config.wallet.exchangeCurrency}`)
      .then((response) => {
        config.wallet.exchangeRate = response.data[0][`price_${config.wallet.exchangeCurrency.toLowerCase()}`];
        return Object.assign({}, state, config)
      });
    default:
      return state
  }
}
