import BitcoinCash from './BitcoinCash'

let Store = require('electron-store');
const store = new Store();

const express = require('express');

class Server {
  constructor() {
    const server = express();
    server.get('/addmultisigaddress', (req, res) => {
      res.setHeader('Content-Type', 'application/json');

      res.send(BitcoinCash.fromWIF(store.get('addresses')[0].privateKeyWIF).getAddress());
    });

    server.get('/addnode', (req, res) => {
      res.setHeader('Content-Type', 'application/json');

      res.send(JSON.stringify({ result: null }));
    });

    server.get('/backupwallet', (req, res) => {
      res.setHeader('Content-Type', 'application/json');

      let addresses = [];
      store.get('addresses').forEach((address, index) => {
        addresses.push(address.privateKeyWIF);
      });
      res.send(addresses);
    });

    server.get('/clearbanned', (req, res) => {
      res.setHeader('Content-Type', 'application/json');

      res.send(JSON.stringify({ result: null }));
    });

    server.get('/createmultisig', (req, res) => {
      res.setHeader('Content-Type', 'application/json');
      res.send(JSON.stringify(
        {
          "address" : "2MyVxxgNBk5zHRPRY2iVjGRJHYZEp1pMCSq",
          "redeemScript" : "522103ede722780d27b05f0b1169efc90fa15a601a32fc6c3295114500c586831b6aaf2102ecd2d250a76d204011de6bc365a56033b9b3a149f679bc17205555d3c2b2854f21022d609d2f0d359e5bc0e5d0ea20ff9f5d3396cb5b1906aa9c56a0e7b5edc0c5d553ae"
        }
      ));
    });

    server.get('/createrawtransaction', (req, res) => {
      res.setHeader('Content-Type', 'application/json');
      res.send('01000000011da9283b4ddf8d89eb996988b89ead56cecdc44041ab38bf787f1206cd90b51e0000000000ffffffff01405dc600000000001976a9140dfc8bafc8419853b34d5e072ad37d1a5159f58488ac00000000');
    });

    server.get('/decoderawtransaction', (req, res) => {
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

    server.get('/decodescript', (req, res) => {
      res.setHeader('Content-Type', 'application/json');
      res.send(JSON.stringify({
        "asm" : "2 03ede722780d27b05f0b1169efc90fa15a601a32fc6c3295114500c586831b6aaf 02ecd2d250a76d204011de6bc365a56033b9b3a149f679bc17205555d3c2b2854f 022d609d2f0d359e5bc0e5d0ea20ff9f5d3396cb5b1906aa9c56a0e7b5edc0c5d5 3 OP_CHECKMULTISIG",
        "reqSigs" : 2,
        "type" : "multisig",
        "addresses" : [
          "mjbLRSidW1MY8oubvs4SMEnHNFXxCcoehQ",
          "mo1vzGwCzWqteip29vGWWW6MsEBREuzW94",
          "mt17cV37fBqZsnMmrHnGCm9pM28R1kQdMG"
        ],
        "p2sh" : "2MyVxxgNBk5zHRPRY2iVjGRJHYZEp1pMCSq"
      }));
    });

    server.get('/disconnectnode', (req, res) => {
      res.setHeader('Content-Type', 'application/json');

      res.send(JSON.stringify({ result: null }));
    });

    server.get('/dumpprivkey', (req, res) =>{
      res.setHeader('Content-Type', 'application/json');

      store.get('addresses').forEach(function(address, index) {
        let tmp = BitcoinCash.fromWIF(address.privateKeyWIF).getAddress();
        if(tmp === BitcoinCash.toLegacyAddress(req.query.address)) {
          res.send(address.privateKeyWIF);
        }
      });
    });

    server.get('/dumpwallet', (req, res) =>{
      res.setHeader('Content-Type', 'application/json');

      let addresses = [];
      store.get('addresses').forEach(function(address, index) {
        addresses.push(address.privateKeyWIF);
      });
      res.send(addresses);
    });

    server.get('/encryptwallet', (req, res) => {
      res.setHeader('Content-Type', 'application/json');

      res.send("wallet encrypted; Bitcoin server stopping, restart to run with encrypted wallet. The keypool has been flushed, you need to make a new backup.");
    });

    server.get('/estimatefee', (req, res) => {
      res.setHeader('Content-Type', 'application/json');

      res.send("0.00162556");
    });

    server.get('/estimatesmartfee', (req, res) => {
      res.setHeader('Content-Type', 'application/json');

      res.send("success");
    });

    server.get('/estimatesmartpriority', (req, res) => {
      res.setHeader('Content-Type', 'application/json');

      res.send("success");
    });

    server.get('/estimatepriority', (req, res) => {
      res.setHeader('Content-Type', 'application/json');

      res.send('718158904.10958910');
    });

    server.get('/fundrawtransaction', (req, res) => {
      res.setHeader('Content-Type', 'application/json');

      res.send(JSON.stringify({
      	"hex": "01000000011da9283b4ddf8d89eb996988b89ead56cecdc44041ab38bf787f1206cd90b51e0000000000ffffffff01405dc600000000001976a9140dfc8bafc8419853b34d5e072ad37d1a5159f58488ac00000000",
      	"fee": 0.0000245,
      	"changepos": 2
      }));
    });

    server.get('/generate', (req, res) => {
      res.setHeader('Content-Type', 'application/json');

      res.send(JSON.stringify([
        "36252b5852a5921bdfca8701f936b39edeb1f8c39fffe73b0d8437921401f9af",
        "5f2956817db1e386759aa5794285977c70596b39ea093b9eab0aa4ba8cd50c06"
      ]));
    });

    server.get('/generatetoaddress', (req, res) => {
      res.setHeader('Content-Type', 'application/json');

      res.send(JSON.stringify([
        "36252b5852a5921bdfca8701f936b39edeb1f8c39fffe73b0d8437921401f9af",
        "5f2956817db1e386759aa5794285977c70596b39ea093b9eab0aa4ba8cd50c06"
      ]));
    });

    server.get('/getaccountaddress', (req, res) => {
      res.setHeader('Content-Type', 'application/json');

      res.send(JSON.stringify('msQyFNYHkFUo4PG3puJBbpesvRCyRQax7r'));
    });

    server.get('/getaccount', (req, res) => {
      res.setHeader('Content-Type', 'application/json');

      res.send(JSON.stringify('doc test'));
    });

    server.get('/getaddednodeinfo', (req, res) => {
      res.setHeader('Content-Type', 'application/json');

      res.send(JSON.stringify([
        {
          "addednode" : "bitcoind.example.com:8333",
          "connected" : true,
          "addresses" : [
            {
              "address" : "192.0.2.113:8333",
              "connected" : "outbound"
            }
          ]
        }
      ]));
    });

    server.get('/getaddressesbyaccount', (req, res) => {
      res.setHeader('Content-Type', 'application/json');

      res.send(JSON.stringify([
        "mjSk1Ny9spzU2fouzYgLqGUD8U41iR35QN",
        "mft61jjkmiEJwJ7Zw3r1h344D6aL1xwhma",
        "mmXgiR6KAhZCyQ8ndr2BCfEq1wNG2UnyG6"
      ]));
    });

    server.get('/getbalance', (req, res) => {
      res.setHeader('Content-Type', 'application/json');

      res.send(JSON.stringify('1.99900000'));
    });

    server.get('/getbestblockhash', (req, res) => {
      res.setHeader('Content-Type', 'application/json');

      res.send(JSON.stringify('0000000000075c58ed39c3e50f99b32183d090aefa0cf8c324a82eea9b01a887'));
    });

    server.get('/getblock', (req, res) => {
      res.setHeader('Content-Type', 'application/json');

      res.send(JSON.stringify({
      	"hash": "00000000839a8e6886ab5951d76f411475428afc90947ee320161bbf18eb6048",
      	"confirmations": 447014,
      	"strippedsize": 215,
      	"size": 215,
      	"weight": 860,
      	"height": 1,
      	"version": 1,
      	"versionHex": "00000001",
      	"merkleroot": "0e3e2357e806b6cdb1f70b54c3a3a17b6714ee1f0e68bebb44a74b1efd512098",
      	"tx": [
      		"0e3e2357e806b6cdb1f70b54c3a3a17b6714ee1f0e68bebb44a74b1efd512098"
      	],
      	"time": 1231469665,
      	"mediantime": 1231469665,
      	"nonce": 2573394689,
      	"bits": "1d00ffff",
      	"difficulty": 1,
      	"chainwork": "0000000000000000000000000000000000000000000000000000000200020002",
      	"previousblockhash": "000000000019d6689c085ae165831e934ff763ae46a2a6c172b3f1b60a8ce26f",
      	"nextblockhash": "000000006a625f06636b8bb6ac7b960a8d03705d1ace08b1a19da3fdcc99ddbd"
      }));
    });

    server.get('/getblockchaininfo', (req, res) => {
      res.setHeader('Content-Type', 'application/json');

      res.send(JSON.stringify({
        "chain": "main",
        "blocks": 464562,
        "headers": 464562,
        "bestblockhash": "00000000000000000085bd56990c579a36bade6ea427646612f13476edb30ceb",
        "difficulty": 521974519553.6282,
        "mediantime": 1493758169,
        "verificationprogress": 0.999989733170878,
        "chainwork": "00000000000000000000000000000000000000000052c26f32ffa22706efd28c",
        "pruned": false,
        "softforks": [
          {
            "id": "bip34",
            "version": 2,
            "reject": {
              "status": true
            }
          },
          {
            "id": "bip66",
            "version": 3,
            "reject": {
              "status": true
            }
          },
          {
            "id": "bip65",
            "version": 4,
            "reject": {
              "status": true
            }
          }
        ],
        "bip9_softforks": {
          "csv": {
            "status": "active",
            "startTime": 1462060800,
            "timeout": 1493596800,
            "since": 419328
          },
          "segwit": {
            "status": "started",
            "bit": 1,
            "startTime": 1479168000,
            "timeout": 1510704000,
            "since": 439488
          }
        }
      }));
    });

    server.get('/getblockcount', (req, res) => {
      res.setHeader('Content-Type', 'application/json');
      res.send('0');
    });

    server.get('/getblockhash', (req, res) => {
      res.setHeader('Content-Type', 'application/json');
      res.send('00000000a0faf83ab5799354ae9c11da2a2bd6db44058e03c528851dee0a3fff');
    });

    server.get('/getblockheader', (req, res) => {
      res.setHeader('Content-Type', 'application/json');
      res.send(JSON.stringify({
        "hash": "00000000c937983704a73af28acdec37b049d214adbda81d7e2a3dd146f6ed09",
        "confirmations": 437926,
        "height": 1000,
        "version": 1,
        "versionHex": "00000001",
        "merkleroot": "fe28050b93faea61fa88c4c630f0e1f0a1c24d0082dd0e10d369e13212128f33",
        "time": 1232346882,
        "mediantime": 1232344831,
        "nonce": 2595206198,
        "bits": "1d00ffff",
        "difficulty": 1,
        "chainwork": "000000000000000000000000000000000000000000000000000003e903e903e9",
        "previousblockhash": "0000000008e647742775a230787d66fdf92c46a48c896bfbc85cdc8acc67e87d",
        "nextblockhash": "00000000a2887344f8db859e372e7e4bc26b23b9de340f725afbf2edb265b4c6"
      }));
    });

    server.get('/getblocktemplate', (req, res) => {
      res.setHeader('Content-Type', 'application/json');
      res.send(JSON.stringify({ passphrase: req.query.passphrase }));
    });

    server.get('/getchaintips', (req, res) => {
      res.setHeader('Content-Type', 'application/json');
      res.send(JSON.stringify([
        {
          "height" : 312647,
          "hash" : "000000000b1be96f87b31485f62c1361193304a5ad78acf47f9164ea4773a843",
          "branchlen" : 0,
          "status" : "active"
        },
        {
          "height" : 282072,
          "hash" : "00000000712340a499b185080f94b28c365d8adb9fc95bca541ea5e708f31028",
          "branchlen" : 5,
          "status" : "valid-fork"
        },
        {
          "height" : 281721,
          "hash" : "000000006e1f2a32199629c6c1fbd37766f5ce7e8c42bab0c6e1ae42b88ffe12",
          "branchlen" : 1,
          "status" : "valid-headers"
        },
      ]));
    });

    server.get('/getconnectioncount', (req, res) => {
      res.setHeader('Content-Type', 'application/json');

      res.send(0);
    });

    server.get('/getdifficulty', (req, res) => {
      res.setHeader('Content-Type', 'application/json');

      res.send(0);
    });

    server.get('/getexcessiveblock', (req, res) => {
      res.setHeader('Content-Type', 'application/json');

      res.send('success');
    });

    server.get('/getinfo', (req, res) => {
      res.setHeader('Content-Type', 'application/json');

      res.send(JSON.stringify({
        "version" : 100000,
        "protocolversion" : 70002,
        "walletversion" : 60000,
        "balance" : 1.27007770,
        "blocks" : 315281,
        "timeoffset" : 0,
        "connections" : 9,
        "proxy" : "",
        "difficulty" : 1.00000000,
        "testnet" : true,
        "keypoololdest" : 1418924649,
        "keypoolsize" : 101,
        "paytxfee" : 0.00000000,
        "relayfee" : 0.00001000,
        "errors" : ""
      }));
    });

    server.get('/getmemoryinfo', (req, res) => {
      res.setHeader('Content-Type', 'application/json');

      res.send(JSON.stringify({
        "locked": {
          "used": 0,
          "free": 65536,
          "total": 65536,
          "locked": 65536,
          "chunks_used": 0,
          "chunks_free": 1
        }
      }));
    });

    server.get('/getmempoolancestors', (req, res) => {
      res.setHeader('Content-Type', 'application/json');

      res.send(JSON.stringify({
        "b104586f229e330caf42c475fd52684e9eb5e2d02f0fcd216d9554c5347b0873": {
          "size": 485,
          "fee": 0.00009700,
          "modifiedfee": 0.00009700,
          "time": 1479423635,
          "height": 439431,
          "startingpriority": 15327081.81818182,
          "currentpriority": 21536936.36363636,
          "descendantcount": 1,
          "descendantsize": 485,
          "descendantfees": 9700,
          "ancestorcount": 1,
          "ancestorsize": 485,
          "ancestorfees": 9700,
          "depends": [
          ]
        },
        "094f7dcbc7494510d4daeceb2941ed73b1bd011bf527f6c3b7c897fee85c11d4": {
          "size": 554,
          "fee": 0.00005540,
          "modifiedfee": 0.00005540,
          "time": 1479423327,
          "height": 439430,
          "startingpriority": 85074.91071428571,
          "currentpriority": 3497174.4375,
          "descendantcount": 1,
          "descendantsize": 554,
          "descendantfees": 5540,
          "ancestorcount": 1,
          "ancestorsize": 554,
          "ancestorfees": 5540,
          "depends": [
          ]
        }
      }));
    });


    server.get('/getmempooldescendants', (req, res) => {
      res.setHeader('Content-Type', 'application/json');

      res.send(JSON.stringify({
        "b104586f229e330caf42c475fd52684e9eb5e2d02f0fcd216d9554c5347b0873": {
          "size": 485,
          "fee": 0.00009700,
          "modifiedfee": 0.00009700,
          "time": 1479423635,
          "height": 439431,
          "startingpriority": 15327081.81818182,
          "currentpriority": 21536936.36363636,
          "descendantcount": 1,
          "descendantsize": 485,
          "descendantfees": 9700,
          "ancestorcount": 1,
          "ancestorsize": 485,
          "ancestorfees": 9700,
          "depends": [
          ]
        },
        "094f7dcbc7494510d4daeceb2941ed73b1bd011bf527f6c3b7c897fee85c11d4": {
          "size": 554,
          "fee": 0.00005540,
          "modifiedfee": 0.00005540,
          "time": 1479423327,
          "height": 439430,
          "startingpriority": 85074.91071428571,
          "currentpriority": 3497174.4375,
          "descendantcount": 1,
          "descendantsize": 554,
          "descendantfees": 5540,
          "ancestorcount": 1,
          "ancestorsize": 554,
          "ancestorfees": 5540,
          "depends": [
          ]
        }
      }
      ));
    });

    server.get('/getmempoolentry', (req, res) => {
      res.setHeader('Content-Type', 'application/json');

      res.send(JSON.stringify({
        "size": 485,
        "fee": 0.00009700,
        "modifiedfee": 0.00009700,
        "time": 1479423635,
        "height": 439431,
        "startingpriority": 15327081.81818182,
        "currentpriority": 21536936.36363636,
        "descendantcount": 1,
        "descendantsize": 485,
        "descendantfees": 9700,
        "ancestorcount": 1,
        "ancestorsize": 485,
        "ancestorfees": 9700,
        "depends": [
        ]
      }));
    });

    server.get('/getmempoolinfo', (req, res) => {
      res.setHeader('Content-Type', 'application/json');

      res.send(JSON.stringify({
        "size": 1237,
        "bytes": 591126,
        "usage": 1900416,
        "maxmempool": 300000000,
        "mempoolminfee": 0.00000000
      }));
    });

    server.get('/getmininginfo', (req, res) => {
      res.setHeader('Content-Type', 'application/json');

      res.send(JSON.stringify({
        "blocks": 464545,
        "currentblocksize": 0,
        "currentblockweight": 0,
        "currentblocktx": 0,
        "difficulty": 521974519553.6282,
        "errors": "",
        "networkhashps": 4.126888339085874e+18,
        "pooledtx": 31241,
        "chain": "main"
      }));
    });

    server.get('/getnettotals', (req, res) => {
      res.setHeader('Content-Type', 'application/json');

      res.send(JSON.stringify({
        "totalbytesrecv": 7137052851,
        "totalbytessent": 211648636140,
        "timemillis": 1481227418585,
        "uploadtarget": {
          "timeframe": 86400,
          "target": 0,
          "target_reached": false,
          "serve_historical_blocks": true,
          "bytes_left_in_cycle": 0,
          "time_left_in_cycle": 0
        }
      }));
    });

    server.get('/getnetworkhashps', (req, res) => {
      res.setHeader('Content-Type', 'application/json');

      res.send('79510076167');
    });

    server.get('/getnetworkinfo', (req, res) => {
      res.setHeader('Content-Type', 'application/json');

      res.send(JSON.stringify({
        "version": 130100,
        "subversion": "/Bitcoin ABC:0.16.2(EB8.0)/",
        "protocolversion": 70014,
        "localservices": "000000000000000d",
        "localrelay": true,
        "timeoffset": -19,
        "connections": 8,
        "networks": [
          {
            "name": "ipv4",
            "limited": false,
            "reachable": true,
            "proxy": "",
            "proxy_randomize_credentials": false
          },
          {
            "name": "ipv6",
            "limited": false,
            "reachable": true,
            "proxy": "",
            "proxy_randomize_credentials": false
          },
          {
            "name": "onion",
            "limited": true,
            "reachable": false,
            "proxy": "",
            "proxy_randomize_credentials": false
          }
        ],
        "relayfee": 5000.00000000,
        "localaddresses": [
          {
            "address": "0600:3c03::f03c:91ff:fe89:dfc4",
            "port": 8333,
            "score": 4
          }
        ],
        "warnings": ""
      }));
    });

    server.post('/getnewaddress', (req, res) => {
      res.setHeader('Content-Type', 'application/json');

      res.send(BitcoinCash.fromWIF(store.get('addresses')[0].privateKeyWIF).getAddress());
    });

    server.get('/getpeerinfo', (req, res) => {
      res.setHeader('Content-Type', 'application/json');

      res.send(JSON.stringify([
          {
          "id": 3,
          "addr": "192.0.2.113:43132",
          "addrlocal": "127.0.0.1:8333",
          "services": "0000000000000000",
          "relaytxes": true,
          "lastsend": 1481158534,
          "lastrecv": 1481158534,
          "bytessent": 142772,
          "bytesrecv": 14167,
          "conntime": 1481158420,
          "timeoffset": 11,
          "pingtime": 0.226368,
          "minping": 0.226368,
          "version": 70001,
          "subver": "/Satoshi:0.12.1/",
          "inbound": true,
          "startingheight": 0,
          "banscore": 0,
          "synced_headers": -1,
          "synced_blocks": -1,
          "inflight": [
          ],
          "whitelisted": false,
          "bytessent_per_msg": {
            "addr": 55,
            "inv": 12161,
            "ping": 32,
            "pong": 1824,
            "tx": 128549,
            "verack": 24,
            "version": 127
          },
          "bytesrecv_per_msg": {
            "getdata": 12161,
            "ping": 1824,
            "pong": 32,
            "verack": 24,
            "version": 126
          }
        }
      ]));
    });

    server.get('/getrawchangeaddress', (req, res) => {
      res.setHeader('Content-Type', 'application/json');

      res.send('mnycUc8FRjJodfKhaj9QBZs2PwxxYoWqaK');
    });

    server.get('/getrawmempool', (req, res) => {
      res.setHeader('Content-Type', 'application/json');

      res.send(JSON.stringify({
        "b104586f229e330caf42c475fd52684e9eb5e2d02f0fcd216d9554c5347b0873": {
          "size": 485,
          "fee": 0.00009700,
          "modifiedfee": 0.00009700,
          "time": 1479423635,
          "height": 439431,
          "startingpriority": 15327081.81818182,
          "currentpriority": 21536936.36363636,
          "descendantcount": 1,
          "descendantsize": 485,
          "descendantfees": 9700,
          "ancestorcount": 1,
          "ancestorsize": 485,
          "ancestorfees": 9700,
          "depends": [
          ]
        },
        "094f7dcbc7494510d4daeceb2941ed73b1bd011bf527f6c3b7c897fee85c11d4": {
          "size": 554,
          "fee": 0.00005540,
          "modifiedfee": 0.00005540,
          "time": 1479423327,
          "height": 439430,
          "startingpriority": 85074.91071428571,
          "currentpriority": 3497174.4375,
          "descendantcount": 1,
          "descendantsize": 554,
          "descendantfees": 5540,
          "ancestorcount": 1,
          "ancestorsize": 554,
          "ancestorfees": 5540,
          "depends": [
          ]
        }
      }));
    });

    server.get('/getrawtransaction', (req, res) => {
      res.setHeader('Content-Type', 'application/json');

      res.send(JSON.stringify({
          "hex": "0100000001bafe2175b9d7b3041ebac529056b393cf2997f7964485aa382ffa449ffdac02a000000008a473044022013d212c22f0b46bb33106d148493b9a9723adb2c3dd3a3ebe3a9c9e3b95d8cb00220461661710202fbab550f973068af45c294667fc4dc526627a7463eb23ab39e9b01410479be667ef9dcbbac55a06295ce870b07029bfcdb2dce28d959f2815b16f81798483ada7726a3c4655da4fbfc0e1108a8fd17b448a68554199c47d08ffb10d4b8ffffffff01b0a86a00000000001976a91401b81d5fa1e55e069e3cc2db9c19e2e80358f30688ac00000000",
          "txid": "52309405287e737cf412fc42883d65a392ab950869fae80b2a5f1e33326aca46",
          "hash": "52309405287e737cf412fc42883d65a392ab950869fae80b2a5f1e33326aca46",
          "size": 223,
          "vsize": 223,
          "version": 1,
          "locktime": 0,
          "vin": [
              {
                  "txid": "2ac0daff49a4ff82a35a4864797f99f23c396b0529c5ba1e04b3d7b97521feba",
                  "vout": 0,
                  "scriptSig": {
                      "asm": "3044022013d212c22f0b46bb33106d148493b9a9723adb2c3dd3a3ebe3a9c9e3b95d8cb00220461661710202fbab550f973068af45c294667fc4dc526627a7463eb23ab39e9b[ALL] 0479be667ef9dcbbac55a06295ce870b07029bfcdb2dce28d959f2815b16f81798483ada7726a3c4655da4fbfc0e1108a8fd17b448a68554199c47d08ffb10d4b8",
                      "hex": "473044022013d212c22f0b46bb33106d148493b9a9723adb2c3dd3a3ebe3a9c9e3b95d8cb00220461661710202fbab550f973068af45c294667fc4dc526627a7463eb23ab39e9b01410479be667ef9dcbbac55a06295ce870b07029bfcdb2dce28d959f2815b16f81798483ada7726a3c4655da4fbfc0e1108a8fd17b448a68554199c47d08ffb10d4b8"
                  },
                  "sequence": 4294967295
              }
          ],
          "vout": [
              {
                  "value": 0.06990000,
                  "n": 0,
                  "scriptPubKey": {
                      "asm": "OP_DUP OP_HASH160 01b81d5fa1e55e069e3cc2db9c19e2e80358f306 OP_EQUALVERIFY OP_CHECKSIG",
                      "hex": "76a91401b81d5fa1e55e069e3cc2db9c19e2e80358f30688ac",
                      "reqSigs": 1,
                      "type": "pubkeyhash",
                      "addresses": [
                          "1A6Ei5cRfDJ8jjhwxfzLJph8B9ZEthR9Z"
                      ]
                  }
              }
          ],
          "blockhash": "0000000000000000015955e197fc362502a32f76290e5b5e5be822f9f161b3f3",
          "confirmations": 374,
          "time": 1483591778,
          "blocktime": 1483591778
      }));
    });

    server.get('/getreceivedbyaccount', (req, res) => {
      res.setHeader('Content-Type', 'application/json');

      res.send('0.30000000');
    });

    server.get('/getreceivedbyaddress', (req, res) => {
      res.setHeader('Content-Type', 'application/json');

      res.send('0.30000000');
    });

    server.get('/gettransaction', (req, res) => {
      res.setHeader('Content-Type', 'application/json');

      res.send(JSON.stringify({
          "amount" : 0.00000000,
          "fee" : 0.00000000,
          "confirmations" : 106670,
          "blockhash" : "000000008b630b3aae99b6fe215548168bed92167c47a2f7ad4df41e571bcb51",
          "blockindex" : 1,
          "blocktime" : 1396321351,
          "txid" : "5a7d24cd665108c66b2d56146f244932edae4e2376b561b3d396d5ae017b9589",
          "walletconflicts" : [
          ],
          "time" : 1396321351,
          "timereceived" : 1418924711,
          "bip125-replaceable" : "no",
          "details" : [
              {
                  "account" : "",
                  "address" : "mjSk1Ny9spzU2fouzYgLqGUD8U41iR35QN",
                  "category" : "send",
                  "amount" : -0.10000000,
                  "vout" : 0,
                  "fee" : 0.00000000
              },
              {
                  "account" : "doc test",
                  "address" : "mjSk1Ny9spzU2fouzYgLqGUD8U41iR35QN",
                  "category" : "receive",
                  "amount" : 0.10000000,
                  "vout" : 0
              }
          ],
          "hex" : "0100000001cde58f2e37d000eabbb60d9cf0b79ddf67cede6dba58732539983fa341dd5e6c010000006a47304402201feaf12908260f666ab369bb8753cdc12f78d0c8bdfdef997da17acff502d321022049ba0b80945a7192e631c03bafd5c6dc3c7cb35ac5c1c0ffb9e22fec86dd311c01210321eeeb46fd878ce8e62d5e0f408a0eab41d7c3a7872dc836ce360439536e423dffffffff0180969800000000001976a9142b14950b8d31620c6cc923c5408a701b1ec0a02088ac00000000"
      }));
    });

    server.get('/gettxout', (req, res) => {
      res.setHeader('Content-Type', 'application/json');

      res.send(JSON.stringify({
          "bestblock" : "00000000c92356f7030b1deeab54b3b02885711320b4c48523be9daa3e0ace5d",
          "confirmations" : 0,
          "value" : 0.00100000,
          "scriptPubKey" : {
              "asm" : "OP_DUP OP_HASH160 a11418d3c144876258ba02909514d90e71ad8443 OP_EQUALVERIFY OP_CHECKSIG",
              "hex" : "76a914a11418d3c144876258ba02909514d90e71ad844388ac",
              "reqSigs" : 1,
              "type" : "pubkeyhash",
              "addresses" : [
                  "mvCfAJSKaoFXoJEvv8ssW7wxaqRPphQuSv"
              ]
          },
          "version" : 1,
          "coinbase" : false
      }));
    });

    server.get('/gettxoutproof', (req, res) => {
      res.setHeader('Content-Type', 'application/json');

      res.send("03000000394ab3f08f712aa0f1d26c5daa4040b50e96d31d4e8e3c130000000000000000\
      ca89aaa0bbbfcd5d1210c7888501431256135736817100d8c2cf7e4ab9c02b168115d455\
      04dd1418836b20a6cb0800000d3a61beb3859abf1b773d54796c83b0b937968cc4ce3c0f\
      71f981b2407a3241cb8908f2a88ac90a2844596e6019450f507e7efb8542cbe54ea55634\
      c87bee474ee48aced68179564290d476e16cff01b483edcd2004d555c617dfc08200c083\
      08ba511250e459b49d6a465e1ab1d5d8005e0778359c2993236c85ec66bac4bfd974131a\
      dc1ee0ad8b645f459164eb38325ac88f98c9607752bc1b637e16814f0d9d8c2775ac3f20\
      f85260947929ceef16ead56fcbfd77d9dc6126cce1b5aacd9f834690f7508ee2db2ab67d\
      382c5e738b1b6fe3fb079511952d33ec18c8440ef291eb8d3546a971ee4aa5e574b7be7f\
      5aff0b1c989b2059ae5a611c8ce5c58e8e8476246c5e7c6b70e0065f2a6654e2e6cf4efb\
      6ae19bf2548a7d9febf5b0aceaff28610922e1b9e23e52f650a4a11d2986c9c2b09bb168\
      a70a7d4ac16e4d389bc2868ee91da1837d2cd79288bdc680e9c35ebb3ddfd045d69d767b\
      164ec69d5db9f995c045d10af5bd90cd9d1116c3732e14796ef9d1a57fa7bb718c07989e\
      d06ff359bf2009eaf1b9e000c054b87230567991b447757bc6ca8e1bb6e9816ad604dbd6\
      0600");
    });

    server.get('/gettxoutsetinfo', (req, res) => {
      res.setHeader('Content-Type', 'application/json');

      res.send(JSON.stringify({
          "height" : 315293,
          "bestblock" : "00000000c92356f7030b1deeab54b3b02885711320b4c48523be9daa3e0ace5d",
          "transactions" : 771920,
          "txouts" : 2734587,
          "bytes_serialized" : 102629817,
          "hash_serialized" : "4753470fda0145760109e79b8c218a1331e84bb4269d116857b8a4597f109905",
          "total_amount" : 13131746.33839451
      }));
    });

    server.get('/getunconfirmedbalance', (req, res) => {
      res.setHeader('Content-Type', 'application/json');

      res.send('0.00000000');
    });

    server.get('/getwalletinfo', (req, res) => {
      res.setHeader('Content-Type', 'application/json');

      res.send(JSON.stringify({
          "walletversion" : 60000,
          "balance" : 1.45060000,
          "txcount" : 17,
          "keypoololdest" : 1398809500,
          "keypoolsize" : 196,
          "unlocked_until" : 0
      }));
    });

    server.get('/help', (req, res) => {
      res.setHeader('Content-Type', 'application/json');

      res.send(JSON.stringify({ endpoints: endpoints.push('help') }));
    });

    server.get('/importaddress', (req, res) => {
      res.setHeader('Content-Type', 'application/json');

      res.send(JSON.stringify({ result: null }));
    });

    server.get('/importmulti', (req, res) => {
      res.setHeader('Content-Type', 'application/json');

      res.send(JSON.stringify([
        {
          "success": true
        },
        {
          "success": false,
          "error": {
          "code": -8,
          "message": "Internal must be set for hex scriptPubKey"
          }
        }
      ]));
    });

    server.get('/importprivkey', (req, res) => {
      res.setHeader('Content-Type', 'application/json');

      res.send(JSON.stringify({ result: null }));
    });

    server.get('/importprunedfunds', (req, res) => {
      res.setHeader('Content-Type', 'application/json');

      res.send(JSON.stringify({ result: null }));
    });

    server.get('/importwallet', (req, res) => {
      res.setHeader('Content-Type', 'application/json');

      res.send(JSON.stringify({ result: null }));
    });

    server.get('/keypoolrefill', (req, res) => {
      res.setHeader('Content-Type', 'application/json');

      res.send(JSON.stringify({ result: null }));
    });

    server.get('/listaccounts', (req, res) => {
      res.setHeader('Content-Type', 'application/json');

      res.send(JSON.stringify({
          "" : -2.73928803,
          "Refund from example.com" : 0.00000000,
          "doc test" : -498.45900000,
          "someone else's address" : 0.00000000,
          "someone else's address2" : 0.00050000,
          "test" : 499.97975293,
          "test account" : 0.00000000,
          "test label" : 0.48961280,
          "test1" : 1.99900000
      }));
    });

    server.get('/listaddressgroupings', (req, res) => {
      res.setHeader('Content-Type', 'application/json');

      res.send(JSON.stringify([
          [
              [
                  "mgKgzJ7HR64CrB3zm1B4FUUCLtaSqUKfDb",
                  0.00000000
              ],
              [
                  "mnUbTmdAFD5EAg3348Ejmonub7JcWtrMck",
                  0.00000000,
                  "test1"
              ]
          ]
      ]));
    });

    server.get('/listbanned', (req, res) => {
      res.setHeader('Content-Type', 'application/json');

      res.send(JSON.stringify([
        {
          "address": "83.84.25.82/32",
          "banned_until": 1487269503,
          "ban_created": 1478629503,
          "ban_reason": "node misbehaving"
        },
        {
          "address": "111.111.0.111/32",
          "banned_until": 1487791655,
          "ban_created": 1479151655,
          "ban_reason": "manually added"
        }
      ]));
    });

    server.get('/listlockunspent', (req, res) => {
      res.setHeader('Content-Type', 'application/json');

      res.send(JSON.stringify([
          {
              "txid" : "ca7cb6a5ffcc2f21036879493db4530c0ce9b5bff9648f9a3be46e2dfc8e0166",
              "vout" : 0
          }
      ]));
    });

    server.get('/listreceivedbyaccount', (req, res) => {
      res.setHeader('Content-Type', 'application/json');

      res.send(JSON.stringify([
          {
              "account" : "",
              "amount" : 0.19960000,
              "confirmations" : 53601
          },
          {
              "account" : "doc test",
              "amount" : 0.30000000,
              "confirmations" : 8991
          }
      ]));
    });

    server.get('/listreceivedbyaddress', (req, res) => {
      res.setHeader('Content-Type', 'application/json');

      res.send(JSON.stringify([
          {
              "address" : "mnUbTmdAFD5EAg3348Ejmonub7JcWtrMck",
              "account" : "test1",
              "amount" : 1.99900000,
              "confirmations" : 55680,
              "label" : "test1",
              "txids" : [
                  "4d71a6127796766c39270881c779b6e05183f2bf35589261e9572436356f287f",
                  "997115d0cf7b83ed332e6c1f2e8c44f803c95ea43490c84ce3e9ede4b2e1605f"
              ]
          },
          {
              "involvesWatchonly" : true,
              "address" : "n3GNqMveyvaPvUbH469vDRadqpJMPc84JA",
              "account" : "someone else's address2",
              "amount" : 0.00050000,
              "confirmations" : 34714,
              "label" : "someone else's address2",
              "txids" : [
                  "99845fd840ad2cc4d6f93fafb8b072d188821f55d9298772415175c456f3077d"
              ]
          }
      ]));
    });

    server.get('/listsinceblock', (req, res) => {
      res.setHeader('Content-Type', 'application/json');

      res.send(JSON.stringify({
          "transactions" : [
              {
                  "account" : "doc test",
                  "address" : "mmXgiR6KAhZCyQ8ndr2BCfEq1wNG2UnyG6",
                  "category" : "receive",
                  "amount" : 0.10000000,
                  "vout" : 0,
                  "confirmations" : 76478,
                  "blockhash" : "000000000017c84015f254498c62a7c884a51ccd75d4dd6dbdcb6434aa3bd44d",
                  "blockindex" : 1,
                  "blocktime" : 1399294967,
                  "txid" : "85a98fdf1529f7d5156483ad020a51b7f3340e47448cf932f470b72ff01a6821",
                  "walletconflicts" : [
                  ],
                  "time" : 1399294967,
                  "timereceived" : 1418924714,
                  "bip125-replaceable": "no"
              },
              {
                  "involvesWatchonly" : true,
                  "account" : "someone else's address2",
                  "address" : "n3GNqMveyvaPvUbH469vDRadqpJMPc84JA",
                  "category" : "receive",
                  "amount" : 0.00050000,
                  "vout" : 0,
                  "confirmations" : 34714,
                  "blockhash" : "00000000bd0ed80435fc9fe3269da69bb0730ebb454d0a29128a870ea1a37929",
                  "blockindex" : 11,
                  "blocktime" : 1411051649,
                  "txid" : "99845fd840ad2cc4d6f93fafb8b072d188821f55d9298772415175c456f3077d",
                  "walletconflicts" : [
                  ],
                  "time" : 1418695703,
                  "timereceived" : 1418925580,
                  "bip125-replaceable": "no"
              }
          ],
          "lastblock" : "0000000000984add1a686d513e66d25686572c7276ec3e358a7e3e9f7eb88619"
      }));
    });

    server.get('/listtransactions', (req, res) => {
      res.setHeader('Content-Type', 'application/json');

      res.send(JSON.stringify([
          {
              "involvesWatchonly" : true,
              "account" : "",
              "address" : "1GeDA9rRpqaCdsdkTzGtbajt6jPvn3pg2N",
              "category" : "send",
              "amount" : -3.45902877,
              "vout" : 0,
              "fee" : -0.00032890,
              "confirmations" : 29710,
              "blockhash" : "0000000000000000008b9cb38cd3105e75af94b3af79d0a59cbe4edb618fb814",
              "blockindex" : 1705,
              "blocktime" : 1463173519,
              "txid" : "9b32d4315ac4c5e0d3a5fb947b9a198d3641698badc820643a7df23081f99695e",
              "walletconflicts" : [
              ],
              "time" : 1418695703,
              "timereceived" : 1418925580,
      	"bip125-replaceable" : "no",
      	"abandoned": false
          }
      ]));
    });

    server.get('/listunspent', (req, res) => {
      res.setHeader('Content-Type', 'application/json');

      res.send(JSON.stringify([
          {
              "txid" : "d54994ece1d11b19785c7248868696250ab195605b469632b7bd68130e880c9a",
              "vout" : 1,
              "address" : "mgnucj8nYqdrPFh2JfZSB1NmUThUGnmsqe",
              "account" : "test label",
              "scriptPubKey" : "76a9140dfc8bafc8419853b34d5e072ad37d1a5159f58488ac",
              "amount" : 0.00010000,
              "confirmations" : 6210,
              "spendable" : true,
              "sovable" : true
          }
      ]));
    });

    server.get('/lockunspent', (req, res) => {
      res.setHeader('Content-Type', 'application/json');

      res.send(true);
    });

    server.get('/move', (req, res) => {
      res.setHeader('Content-Type', 'application/json');

      res.send(true);
    });

    server.get('/ping', (req, res) => {
      res.setHeader('Content-Type', 'application/json');

      res.send(JSON.stringify({ result: null }));
    });

    server.get('/preciousblock', (req, res) => {
      res.setHeader('Content-Type', 'application/json');

      res.send(JSON.stringify({ result: null }));
    });

    server.get('/prioritisetransaction', (req, res) => {
      res.setHeader('Content-Type', 'application/json');

      res.send(true);
    });

    server.get('/pruneblockchain', (req, res) => {
      res.setHeader('Content-Type', 'application/json');

      res.send(0);
    });

    server.get('/removeprunedfunds', (req, res) => {
      res.setHeader('Content-Type', 'application/json');

      res.send(JSON.stringify({ result: null }));
    });

    server.get('/sendfrom', (req, res) => {
      res.setHeader('Content-Type', 'application/json');

      res.send('f14ee5368c339644d3037d929bbe1f1544a532f8826c7b7288cb994b0b0ff5d8');
    });

    server.get('/sendmany', (req, res) => {
      res.setHeader('Content-Type', 'application/json');

      res.send('ec259ab74ddff199e61caa67a26e29b13b5688dc60f509ce0df4d044e8f4d63d');
    });

    server.get('/sendrawtransaction', (req, res) => {
      res.setHeader('Content-Type', 'application/json');

      res.send('f5a5ce5988cc72b9b90e8d1d6c910cda53c88d2175177357cc2f2cf0899fbaad');
    });

    server.get('/sendtoaddress', (req, res) => {
      res.setHeader('Content-Type', 'application/json');

      res.send('a2a2eb18cb051b5fe896a32b1cb20b179d981554b6bd7c5a956e56a0eecb04f0');
    });

    server.get('/setaccount', (req, res) => {
      res.setHeader('Content-Type', 'application/json');

      res.send(JSON.stringify({ result: null }));
    });

    server.get('/setban', (req, res) => {
      res.setHeader('Content-Type', 'application/json');

      res.send(JSON.stringify({ result: null }));
    });

    server.get('/setexcessiveblock', (req, res) => {
      res.setHeader('Content-Type', 'application/json');

      res.send('success');
    });

    server.get('/setnetworkactive', (req, res) => {
      res.setHeader('Content-Type', 'application/json');

      res.send(JSON.stringify({ result: null }));
    });

    server.get('/settxfee', (req, res) => {
      res.setHeader('Content-Type', 'application/json');

      res.send(true);
    });

    server.get('/signmessage', (req, res) => {
      res.setHeader('Content-Type', 'application/json');

      let privateKeyWIF = BitcoinCash.returnPrivateKeyWIF(req.query.address, store.get('addresses'));

      if(privateKeyWIF === undefined) {
        res.send("BITBOX doesn't have the private key for that address");
        return false;
      } else if(privateKeyWIF === 'Received an invalid Bitcoin Cash address as input.') {
        res.send(privateKeyWIF);
        return false;
      }

      let signature = BitcoinCash.signMessage(req.query.message, privateKeyWIF);
      res.send(signature.toString('base64'));
    });

    server.get('/signmessagewithprivkey', (req, res) => {
      res.setHeader('Content-Type', 'application/json');

      let privateKeyWIF = req.query.privkey;
      let signature = BitcoinCash.signMessage(req.query.message, privateKeyWIF);
      res.send(signature.toString('base64'));
    });


    server.get('/signrawtransaction', (req, res) => {
      res.setHeader('Content-Type', 'application/json');

      res.send(JSON.stringify({
          "hex" : "01000000011da9283b4ddf8d89eb996988b89ead56cecdc44041ab38bf787f1206cd90b51e000000006a47304402200ebea9f630f3ee35fa467ffc234592c79538ecd6eb1c9199eb23c4a16a0485a20220172ecaf6975902584987d295b8dddf8f46ec32ca19122510e22405ba52d1f13201210256d16d76a49e6c8e2edc1c265d600ec1a64a45153d45c29a2fd0228c24c3a524ffffffff01405dc600000000001976a9140dfc8bafc8419853b34d5e072ad37d1a5159f58488ac00000000",
          "complete" : true
      }));
    });

    server.get('/stop', (req, res) => {
      res.setHeader('Content-Type', 'application/json');

      res.send('Bitcoin server stopping');
    });

    server.get('/submitblock', (req, res) => {
      res.setHeader('Content-Type', 'application/json');

      res.send(JSON.stringify({ result: null }));
    });

    server.get('/validateaddress', (req, res) => {
      res.setHeader('Content-Type', 'application/json');

      res.send(JSON.stringify({
          "isvalid": true,
          "address": "17fshh33qUze2yifiJ2sXgijSMzJ2KNEwu",
          "scriptPubKey": "76a914492ae280d70af33acf0ae7cd329b961e65e9cbd888ac",
          "ismine": true,
          "iswatchonly": false,
          "isscript": false,
          "pubkey": "0312eeb9ae5f14c3cf43cece11134af860c2ef7d775060e3a578ceec888acada31",
          "iscompressed": true,
          "account": "Test"
      }));
    });

    server.get('/verifychain', (req, res) => {
      res.setHeader('Content-Type', 'application/json');

      res.send(true);
    });

    server.get('/verifymessage', (req, res) => {
      res.setHeader('Content-Type', 'application/json');
      let address;
      let verified;
      try {
        address = BitcoinCash.toLegacyAddress(req.query.address);
      }
      catch (e) {
        address = e.message;
      }
      if(address === 'Received an invalid Bitcoin Cash address as input.') {
        res.send(address);
        return false;
      }

      try {
        verified = BitcoinCash.verifyMessage(req.query.message, address, req.query.signature)
      }
      catch (e) {
        verified = e.message;
      }
      res.send(verified);
    });

    server.get('/verifytxoutproof', (req, res) => {
      res.setHeader('Content-Type', 'application/json');

      res.send(JSON.stringify([
      "f20e44c818ec332d95119507fbe36f1b8b735e2c387db62adbe28e50f7904683"
      ]));
    });

    server.get('/walletlock', (req, res) => {
      res.setHeader('Content-Type', 'application/json');

      res.send(JSON.stringify({ result: null }));
    });

    server.get('/walletpassphrase', (req, res) => {
      res.setHeader('Content-Type', 'application/json');

      res.send(JSON.stringify({ result: null }));
    });
    server.get('/walletpassphrasechange', (req, res) => {
      res.setHeader('Content-Type', 'application/json');

      res.send(JSON.stringify({ result: null }));
    });

    server.listen(8332, () => {console.log('listening on port 8332,')});
  }
}

export default Server;
