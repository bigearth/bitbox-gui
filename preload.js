let BITBOXCli = require('bitbox-cli/lib/bitboxcli').default;
window.electron = require('electron');

window.Store = require('electron-store');
window.bitbox = new BITBOXCli();

window.store = new window.Store();
