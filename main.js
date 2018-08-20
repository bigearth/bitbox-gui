require("babel-register");


//handle setupevents as quickly as possible
 const setupEvents = require('./installers/setupEvents')
 if (setupEvents.handleSquirrelEvent()) {
    // squirrel event handled and app will exit in 1000ms, so don't do anything else
    return;
 }


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

let sv = require('./sv');
let Sv = sv.Server;
let Server = new Sv();

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
    width: 1281,
    height: 1000,
    minWidth: 1281,
    maxWidth: 1500,
    minHeight: 800,
    maxHeight: 1400,
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
