const electron = require('electron');
// Module to control application life.
const app = electron.app
const Menu = electron.Menu;
// Module to create native browser window.
const BrowserWindow = electron.BrowserWindow

const path = require('path');
const url = require('url');
const express = require('express');

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow

function createWindow () {
  // Check if we are on a MAC
  if (process.platform === 'darwin') {
    // Create our menu entries so that we can use MAC shortcuts
    Menu.setApplicationMenu(Menu.buildFromTemplate([
      {
        label: 'Edit',
        submenu: [
          {role: 'copy'},
          {role: 'paste'},
          {role: 'quit'}
        ]
      },
      {
        label: 'View',
        submenu: [
          {role: 'toggledevtools'}
        ]
      }
    ]));
  }

  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 1550,
    height: 1000,
    minWidth: 1281,
    minHeight: 800,
    icon: path.join(__dirname, './assets/icons/mac/icon.icns'),
    backgroundColor: '#6FBEF3',
    show: false
  });

  mainWindow.once('ready-to-show', () => {
    mainWindow.show()
  })

  // and load the index.html of the app.
  mainWindow.loadURL(url.format({
    pathname: path.join(__dirname, 'index.html'),
    protocol: 'file:',
    slashes: true
  }))

  // Open the DevTools.
  // mainWindow.webContents.openDevTools()

  // Emitted when the window is closed.
  mainWindow.on('closed', function () {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null
  })

  const server = express();
  let endpoints = [
    'abandonTransaction',
    'addmultisigaddress',
    'addnode',
    'addwitnessaddress',
    'backupWallet',
    'bumpfee',
    'clearbanned',
    'createmultisig',
    'createrawtransaction',
    'decoderawtransaction',
    'decodescript',
    'disconnectnode',
    'dumpprivkey',
    'dumpwallet',
    'encryptwallet',
    'estimatefee',
    'estimatepriority',
    'fundrawtransaction',
    'generate',
    'generatetoaddress',
    'getaccountaddress',
    'getaccount',
    'getaddednodeinfo',
    'getaddressesbyaccount',
    'getbalance',
    'getbestblockhash',
    'getblock',
    'getblockchaininfo',
    'getblockcount',
    'getblockhash',
    'getblockheader',
    'getblocktemplate',
    'getchaintips',
    'getconnectioncount',
    'getdifficulty',
    'getgenerate',
    'gethashespersec',
    'getinfo',
    'getmemoryinfo',
    'getmempoolancestors',
    'getmempooldescendants',
    'getmempoolentry',
    'getmempoolinfo',
    'getmininginfo',
    'getnettotals',
    'getnetworkhashps',
    'getnetworkinfo',
    'getpeerinfo',
    'getrawchangeaddress',
    'getrawmempool',
    'getrawtransaction',
    'getreceivedbyaccount',
    'getreceivedbyaddress',
    'gettransaction',
    'gettxout',
    'gettxoutproof',
    'gettxoutsetinfo',
    'getunconfirmedbalance',
    'getwalletinfo',
    'getwork',
    'importaddress',
    'importmulti',
    'importprivkey',
    'importprunedfunds',
    'importwallet',
    'keypoolrefill',
    'listaccounts',
    'listaddressgroupings',
    'listbanned',
    'listlockunspent',
    'listreceivedbyaccount',
    'listreceivedbyaddress',
    'listsinceblock',
    'listtransactions',
    'listunspent',
    'lockunspent',
    'move',
    'ping-rpc',
    'preciousblock',
    'prioritisetransaction',
    'pruneblockchain',
    'removeprunedfunds',
    'sendfrom',
    'sendmany',
    'sendrawtransaction',
    'sendtoaddress',
    'setaccount',
    'setban',
    'setgenerate',
    'setnetworkactive',
    'settxfee',
    'signmessage',
    'signmessagewithprivkey',
    'signrawtransaction',
    'stop',
    'submitblock',
    'validateaddress',
    'verifychain',
    'verifymessage',
    'verifytxoutproof',
    'walletlock',
    'walletpassphrase',
    'walletpassphrasechange'
  ];
  endpoints.forEach(function(endpoint, index) {
    server.get('/' + endpoint, function(req, res) {
      res.setHeader('Content-Type', 'application/json');
      res.send(JSON.stringify({ endpoint: endpoint }));
    });
  });

  server.get('/help', function(req, res) {
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify({ endpoints: endpoints.push('help') }));
  });

  server.post('/getnewaddress', function(req, res) {
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify({ endpoints: endpoints.push('help') }));
  });
  server.listen(8332, function() {console.log('listening on port 8332,')});
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow)

// Quit when all windows are closed.
app.on('window-all-closed', function () {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', function () {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow()
  }
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
