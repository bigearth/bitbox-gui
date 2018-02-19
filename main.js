require("babel-register");


let electron = require('electron');

// Module to control application life.
const app = electron.app
const Menu = electron.Menu;
// Module to create native browser window.
const BrowserWindow = electron.BrowserWindow

const path = require('path');
const url = require('url');
const express = require('express');

let Store = require('electron-store');
const store = new Store();

let bc = require('./bc');
let BitcoinCash = bc.BitcoinCash;

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
    show: false,
    webPreferences: {
      preload: __dirname + '/preload.js'
    }
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

  server.get('/abandontransaction', function(req, res) {
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify({ status: req.query.txid }));
  });

  server.get('/addmultisigaddress', function(req, res) {
    res.setHeader('Content-Type', 'application/json');
    res.send(BitcoinCash.fromWIF(store.get('addresses')[0].privateKeyWIF).getAddress());
  });

  server.get('/addnode', function(req, res) {
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify({ node: req.query.node }));
  });

  server.get('/addwitnessaddress', function(req, res) {
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify({ address: req.query.address }));
  });

  server.get('/backupWallet', function(req, res) {
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify({ destination: req.query.destination }));
  });

  server.get('/bumpfee', function(req, res) {
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify({ txid: req.query.txid }));
  });

  server.get('/clearbanned', function(req, res) {
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify({ status: 'success' }));
  });

  server.get('/createmultisig', function(req, res) {
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify(
      {
        "address" : "2MyVxxgNBk5zHRPRY2iVjGRJHYZEp1pMCSq",
        "redeemScript" : "522103ede722780d27b05f0b1169efc90fa15a601a32fc6c3295114500c586831b6aaf2102ecd2d250a76d204011de6bc365a56033b9b3a149f679bc17205555d3c2b2854f21022d609d2f0d359e5bc0e5d0ea20ff9f5d3396cb5b1906aa9c56a0e7b5edc0c5d553ae"
      }
    ));
  });

  server.get('/createrawtransaction', function(req, res) {
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify(
      {
        "address" : "2MyVxxgNBk5zHRPRY2iVjGRJHYZEp1pMCSq",
        "redeemScript" : "522103ede722780d27b05f0b1169efc90fa15a601a32fc6c3295114500c586831b6aaf2102ecd2d250a76d204011de6bc365a56033b9b3a149f679bc17205555d3c2b2854f21022d609d2f0d359e5bc0e5d0ea20ff9f5d3396cb5b1906aa9c56a0e7b5edc0c5d553ae"
      }
    ));
  });

  server.get('/decodescript', function(req, res) {
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify({ redeemScript: req.query.redeemScript }));
  });

  server.get('/decoderawtransaction', function(req, res) {
    res.setHeader('Content-Type', 'application/json');

    let t = BitcoinCash.transaction();
    let decodedTx = t.fromHex(req.query.rawHex);

    let a = BitcoinCash.address();
    let s = BitcoinCash.script();
    let ins = [];
    let ecpair = BitcoinCash.ECPair();
    decodedTx.ins.forEach((input, index) => {
      let chunksIn = s.decompile(input.script);
      let inputPubKey = ecpair.fromPublicKeyBuffer(chunksIn[1]).getAddress();
      ins.push({
        inputPubKey: inputPubKey,
        hex: input.script.toString('hex'),
        script: s.toASM(chunksIn)
      });
    })
    decodedTx.ins = ins;

    let outs = [];
    let value = 0;
    decodedTx.outs.forEach((output, index) => {
      value += output.value;
      let chunksIn = s.decompile(output.script);
      let outputPubKey = a.fromOutputScript(output.script);
      outs.push({
        outputPubKey: outputPubKey,
        hex: output.script.toString('hex'),
        script: s.toASM(chunksIn)
      });
    })
    decodedTx.outs = outs;

    res.send(decodedTx);
  });

  server.get('/disconnectnode', function(req, res) {
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify({ address: req.query.address }));
  });

  server.get('/dumpprivkey', function(req, res) {
    res.setHeader('Content-Type', 'application/json');
    store.get('addresses').forEach(function(address, index) {
      let tmp = BitcoinCash.fromWIF(address.privateKeyWIF).getAddress();
      if(tmp === BitcoinCash.toLegacyAddress(req.query.address)) {
        res.send(address.privateKeyWIF);
      }
    });
  });

  server.get('/dumpwallet', function(req, res) {
    res.setHeader('Content-Type', 'application/json');
    let addresses = [];
    store.get('addresses').forEach(function(address, index) {
      addresses.push(address.privateKeyWIF);
    });
    res.send(addresses);
  });

  server.get('/encryptwallet', function(req, res) {
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify({ passphrase: req.query.passphrase }));
  });

  server.get('/estimatefee', function(req, res) {
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify({ passphrase: req.query.passphrase }));
  });

  server.get('/estimatepriority', function(req, res) {
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify({ passphrase: req.query.passphrase }));
  });

  server.get('/fundrawtransaction', function(req, res) {
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify({ passphrase: req.query.passphrase }));
  });

  server.get('/generate', function(req, res) {
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify({ passphrase: req.query.passphrase }));
  });

  server.get('/generatetoaddress', function(req, res) {
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify({ passphrase: req.query.passphrase }));
  });

  server.get('/getaccountaddress', function(req, res) {
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify({ passphrase: req.query.passphrase }));
  });

  server.get('/getaccount', function(req, res) {
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify({ passphrase: req.query.passphrase }));
  });

  server.get('/getaddednodeinfo', function(req, res) {
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify({ passphrase: req.query.passphrase }));
  });

  server.get('/getaddressesbyaccount', function(req, res) {
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify({ passphrase: req.query.passphrase }));
  });

  server.get('/getbalance', function(req, res) {
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify({ passphrase: req.query.passphrase }));
  });

  server.get('/help', function(req, res) {
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify({ endpoints: endpoints.push('help') }));
  });

  server.post('/getnewaddress', function(req, res) {
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify({ endpoints: endpoints.push('help') }));
  });

  server.get('/getbestblockhash', function(req, res) {
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify({ passphrase: req.query.passphrase }));
  });

  server.get('/getblock', function(req, res) {
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify({ passphrase: req.query.passphrase }));
  });

  server.get('/getblockchaininfo', function(req, res) {
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify({ passphrase: req.query.passphrase }));
  });

  server.get('/getblockcount', function(req, res) {
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify({ passphrase: req.query.passphrase }));
  });

  server.get('/getblockhash', function(req, res) {
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify({ passphrase: req.query.passphrase }));
  });

  server.get('/getblockheader', function(req, res) {
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify({ passphrase: req.query.passphrase }));
  });

  server.get('/getblocktemplate', function(req, res) {
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify({ passphrase: req.query.passphrase }));
  });

  server.get('/getchaintips', function(req, res) {
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify({ passphrase: req.query.passphrase }));
  });

  server.get('/getconnectioncount', function(req, res) {
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify({ passphrase: req.query.passphrase }));
  });

  server.get('/getdifficulty', function(req, res) {
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify({ passphrase: req.query.passphrase }));
  });

  server.get('/getgenerate', function(req, res) {
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify({ passphrase: req.query.passphrase }));
  });

  server.get('/gethashespersec', function(req, res) {
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify({ passphrase: req.query.passphrase }));
  });

  server.get('/getinfo', function(req, res) {
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify({ passphrase: req.query.passphrase }));
  });

  server.get('/getmemoryinfo', function(req, res) {
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify({ passphrase: req.query.passphrase }));
  });

  server.get('/getmempooldescendants', function(req, res) {
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify({ passphrase: req.query.passphrase }));
  });

  server.get('/getmempoolentry', function(req, res) {
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify({ passphrase: req.query.passphrase }));
  });

  server.get('/getmempoolinfo', function(req, res) {
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify({ passphrase: req.query.passphrase }));
  });

  server.get('/getmininginfo', function(req, res) {
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify({ passphrase: req.query.passphrase }));
  });

  server.get('/getnettotals', function(req, res) {
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify({ passphrase: req.query.passphrase }));
  });

  server.get('/getnetworkhashps', function(req, res) {
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify({ passphrase: req.query.passphrase }));
  });

  server.get('/getnetworkinfo', function(req, res) {
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify({ passphrase: req.query.passphrase }));
  });

  server.get('/getpeerinfo', function(req, res) {
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify({ passphrase: req.query.passphrase }));
  });

  server.get('/getrawchangeaddress', function(req, res) {
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify({ passphrase: req.query.passphrase }));
  });

  server.get('/getrawmempool', function(req, res) {
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify({ passphrase: req.query.passphrase }));
  });

  server.get('/getrawtransaction', function(req, res) {
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify({ passphrase: req.query.passphrase }));
  });

  server.get('/getreceivedbyaccount', function(req, res) {
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify({ passphrase: req.query.passphrase }));
  });

  server.get('/getreceivedbyaddress', function(req, res) {
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify({ passphrase: req.query.passphrase }));
  });

  server.get('/gettransaction', function(req, res) {
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify({ passphrase: req.query.passphrase }));
  });

  server.get('/gettxout', function(req, res) {
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify({ passphrase: req.query.passphrase }));
  });

  server.get('/gettxoutproof', function(req, res) {
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify({ passphrase: req.query.passphrase }));
  });

  server.get('/gettxoutsetinfo', function(req, res) {
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify({ passphrase: req.query.passphrase }));
  });

  server.get('/getunconfirmedbalance', function(req, res) {
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify({ passphrase: req.query.passphrase }));
  });

  server.get('/getwalletinfo', function(req, res) {
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify({ passphrase: req.query.passphrase }));
  });

  server.get('/getwork', function(req, res) {
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify({ passphrase: req.query.passphrase }));
  });

  server.get('/importaddress', function(req, res) {
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify({ passphrase: req.query.passphrase }));
  });

  server.get('/importmulti', function(req, res) {
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify({ passphrase: req.query.passphrase }));
  });

  server.get('/importprivkey', function(req, res) {
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify({ passphrase: req.query.passphrase }));
  });

  server.get('/importprunedfunds', function(req, res) {
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify({ passphrase: req.query.passphrase }));
  });

  server.get('/importwallet', function(req, res) {
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify({ passphrase: req.query.passphrase }));
  });

  server.get('/keypoolrefill', function(req, res) {
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify({ passphrase: req.query.passphrase }));
  });

  server.get('/listaccounts', function(req, res) {
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify({ passphrase: req.query.passphrase }));
  });

  server.get('/listaddressgroupings', function(req, res) {
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify({ passphrase: req.query.passphrase }));
  });

  server.get('/listbanned', function(req, res) {
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify({ passphrase: req.query.passphrase }));
  });

  server.get('/listlockunspent', function(req, res) {
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify({ passphrase: req.query.passphrase }));
  });

  server.get('/listreceivedbyaccount', function(req, res) {
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify({ passphrase: req.query.passphrase }));
  });

  server.get('/listreceivedbyaddress', function(req, res) {
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify({ passphrase: req.query.passphrase }));
  });

  server.get('/listsinceblock', function(req, res) {
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify({ passphrase: req.query.passphrase }));
  });

  server.get('/listtransactions', function(req, res) {
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify({ passphrase: req.query.passphrase }));
  });

  server.get('/listunspent', function(req, res) {
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify({ passphrase: req.query.passphrase }));
  });

  server.get('/lockunspent', function(req, res) {
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify({ passphrase: req.query.passphrase }));
  });

  server.get('/move', function(req, res) {
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify({ passphrase: req.query.passphrase }));
  });

  server.get('/ping-rpc', function(req, res) {
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify({ passphrase: req.query.passphrase }));
  });

  server.get('/preciousblock', function(req, res) {
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify({ passphrase: req.query.passphrase }));
  });

  server.get('/prioritisetransaction', function(req, res) {
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify({ passphrase: req.query.passphrase }));
  });

  server.get('/pruneblockchain', function(req, res) {
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify({ passphrase: req.query.passphrase }));
  });

  server.get('/removeprunedfunds', function(req, res) {
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify({ passphrase: req.query.passphrase }));
  });

  server.get('/sendfrom', function(req, res) {
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify({ passphrase: req.query.passphrase }));
  });

  server.get('/sendmany', function(req, res) {
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify({ passphrase: req.query.passphrase }));
  });

  server.get('/sendrawtransaction', function(req, res) {
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify({ passphrase: req.query.passphrase }));
  });

  server.get('/sendtoaddress', function(req, res) {
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify({ passphrase: req.query.passphrase }));
  });

  server.get('/setaccount', function(req, res) {
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify({ passphrase: req.query.passphrase }));
  });

  server.get('/setban', function(req, res) {
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify({ passphrase: req.query.passphrase }));
  });

  server.get('/setgenerate', function(req, res) {
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify({ passphrase: req.query.passphrase }));
  });

  server.get('/setnetworkactive', function(req, res) {
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify({ passphrase: req.query.passphrase }));
  });

  server.get('/settxfee', function(req, res) {
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify({ passphrase: req.query.passphrase }));
  });

  server.get('/signmessage', function(req, res) {
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify({ passphrase: req.query.passphrase }));
  });

  server.get('/signmessagewithprivkey', function(req, res) {
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify({ passphrase: req.query.passphrase }));
  });


  server.get('/signrawtransaction', function(req, res) {
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify({ passphrase: req.query.passphrase }));
  });

  server.get('/stop', function(req, res) {
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify({ passphrase: req.query.passphrase }));
  });

  server.get('/submitblock', function(req, res) {
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify({ passphrase: req.query.passphrase }));
  });

  server.get('/validateaddress', function(req, res) {
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify({ passphrase: req.query.passphrase }));
  });

  server.get('/verifychain', function(req, res) {
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify({ passphrase: req.query.passphrase }));
  });

  server.get('/verifymessage', function(req, res) {
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify({ passphrase: req.query.passphrase }));
  });

  server.get('/verifytxoutproof', function(req, res) {
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify({ passphrase: req.query.passphrase }));
  });

  server.get('/walletlock', function(req, res) {
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify({ passphrase: req.query.passphrase }));
  });

  server.get('/walletpassphrase', function(req, res) {
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify({ passphrase: req.query.passphrase }));
  });
  server.get('/walletpassphrasechange', function(req, res) {
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify({ passphrase: req.query.passphrase }));
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
