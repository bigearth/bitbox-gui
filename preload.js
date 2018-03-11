let BITBOXCli = require('bitbox-cli/lib/bitboxcli').default;
window.electron = require('electron');

window.Store = require('electron-store');
window.bitbox = new BITBOXCli({
  protocol: 'http',
  host: '127.0.0.1',
  port: 8332,
  username: '',
  password: ''
});

window.store = new window.Store();
