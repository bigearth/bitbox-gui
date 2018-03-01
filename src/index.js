import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';

ReactDOM.render(
  <App />
  , document.getElementById('root')
);

//
// * BITBOX
//   * Wallet
//     * Account
//   * Configuration
//     * Wallet Configuration
//
// {
//   "configuration": {
//     "wallet": {
//       "autogenerateHDMnemonic": false,
//       "autogenerateHDPath": false,
//       "displayCashaddr": false,
//       "displayTestnet": false,
//       "usePassword": false,
//       "entropy": 32,
//       "network": "test",
//       "mnemonic": "business antique staff gap chief harbor federal answer bright icon badge polar",
//       "totalAccounts": 25,
//       "HDPath": "m/1'/2'/3'",
//       "password": "l337"
//     }
//   },
//   "wallet": {
//     "accounts": [
//       {
//         "title": "",
//         "index": 1,
//         "privateKeyWIF": "cUApFdjmeuy1Y8BRprntVKzCVYTEn5bMiQ4zJoTJkAtLhLe1poMg",
//         "xpriv": "tprv8fr6Gny9YSnHPJpoaUr7jNuwfmGYNvckQQgoKGPkdv1PhPnsa2pT7zUwiHztmWbfmH5jQQMqRjYWLkfcLo5hjEWfrR3VXfignzDakTn4ncH",
//         "xpub": "tpubDCY8RD1PgpTxGmrbU8Wi8na4EnnUYFoeyiHabnS44BonXt3eCRe3JV6otQuJdgaX6mTLBuRtnLh45GwotjyuwWQ69j4nVQQjwtS9Syhgqai",
//         "toggleDisplayAccount": false
//       }
//     ],
//     "rootSeed": "root seed",
//     "masterPrivateKey": "master private key"
//   }
// }
