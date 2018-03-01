import React from 'react';
import { Provider } from 'react-redux'
import { createStore } from 'redux'
import ReactDOM from 'react-dom';
import bitbox from './reducers/bitbox'
import './index.css';
import App from './App';
import {
  createConfig,
  toggleWalletConfig,
  updateWalletConfig
} from './actions/ConfigurationActions';

import {
  createWallet,
  addRootSeed,
  addMasterPrivateKey,
  createAccount,
  toggleDisplayAccount
} from './actions/WalletActions';

let store = createStore(bitbox)

const unsubscribe = store.subscribe(() =>{
  console.log(JSON.stringify(store.getState(), null, 2))
  console.log('**');
})
 
// Dispatch some actions
let mnemonic = 'business antique staff gap chief harbor federal answer bright icon badge polar';
store.dispatch(createConfig())
store.dispatch(toggleWalletConfig(false, 'autogenerateHDMnemonic'))
store.dispatch(toggleWalletConfig(false, 'autogenerateHDPath'))
store.dispatch(toggleWalletConfig(false, 'displayCashaddr'))
store.dispatch(toggleWalletConfig(false, 'displayTestnet'))
store.dispatch(toggleWalletConfig(false, 'usePassword'))

store.dispatch(updateWalletConfig(32, 'entropy'))
store.dispatch(updateWalletConfig('test', 'network'))
store.dispatch(updateWalletConfig(mnemonic, 'mnemonic'))
store.dispatch(updateWalletConfig(25, 'totalAccounts'))
store.dispatch(updateWalletConfig("m/1'/2'/3'", 'HDPath'))
store.dispatch(updateWalletConfig('l337', 'password'))

store.dispatch(createWallet())
store.dispatch(addRootSeed('root seed'))
store.dispatch(addMasterPrivateKey('master private key'))
store.dispatch(createAccount({
  title: '',
  index: 1,
  privateKeyWIF: 'cUApFdjmeuy1Y8BRprntVKzCVYTEn5bMiQ4zJoTJkAtLhLe1poMg',
  xpriv: 'tprv8fr6Gny9YSnHPJpoaUr7jNuwfmGYNvckQQgoKGPkdv1PhPnsa2pT7zUwiHztmWbfmH5jQQMqRjYWLkfcLo5hjEWfrR3VXfignzDakTn4ncH',
  xpub: 'tpubDCY8RD1PgpTxGmrbU8Wi8na4EnnUYFoeyiHabnS44BonXt3eCRe3JV6otQuJdgaX6mTLBuRtnLh45GwotjyuwWQ69j4nVQQjwtS9Syhgqai'
}))
store.dispatch(toggleDisplayAccount(1))
store.dispatch(toggleDisplayAccount(1))
//
// Stop listening to state updates
unsubscribe()


ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>
  , document.getElementById('root')
);
