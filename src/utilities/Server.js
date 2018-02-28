import BitcoinCash from './BitcoinCash'
import Bitcoin from 'bitcoinjs-lib';

import Store from 'electron-store';
const store = new Store();

import express from 'express';
import cors from 'cors';

import axios from 'axios';
import bodyParser from 'body-parser';

class Server {
  constructor() {
    const server = express();
    let port = 8332;
    server.use(cors());
    server.use(bodyParser.json()); // support json encoded bodies
    server.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies
    server.post('/', (req, res) => {
      res.setHeader('Content-Type', 'application/json');
      axios.post(`http://127.0.0.1:${port}/${req.body.method}`, req.body)
      .then((response) => {
        res.send({
          result: response.data
        });
      })
      .catch((error) => {
        res.send(error);
      });
    });

    server.post('/addmultisigaddress', (req, res) => {
      res.setHeader('Content-Type', 'application/json');
      let params = req.body.params;
      let nrequired = params[0];
      let keys = params[1];
      let addresses = store.get('addresses');
      let wallet = store.get('wallet');
      let resp = BitcoinCash.createMultiSig(nrequired, keys, addresses, wallet);
      res.send(resp.address);
    });

    server.post('/addnode', (req, res) => {
      res.setHeader('Content-Type', 'application/json');

      res.send();
    });

    server.post('/backupwallet', (req, res) => {
      res.setHeader('Content-Type', 'application/json');

      let addresses = [];
      store.get('addresses').forEach((address, index) => {
        addresses.push(address.privateKeyWIF);
      });
      res.send(addresses);
    });

    server.post('/clearbanned', (req, res) => {
      res.setHeader('Content-Type', 'application/json');

      res.send();
    });

    server.post('/createmultisig', (req, res) => {
      res.setHeader('Content-Type', 'application/json');
      let params = req.body.params;
      let nrequired = params[0];
      let keys = params[1];
      let addresses = store.get('addresses');
      let wallet = store.get('wallet');
      let resp = BitcoinCash.createMultiSig(nrequired, keys, addresses, wallet);
      res.send(JSON.stringify(
        {
          "address" : resp.address,
          "redeemScript" : resp.redeemScript.toString('hex')
        }
      ));
    });

    server.post('/createrawtransaction', (req, res) => {
      res.setHeader('Content-Type', 'application/json');
      res.send('01000000011da9283b4ddf8d89eb996988b89ead56cecdc44041ab38bf787f1206cd90b51e0000000000ffffffff01405dc600000000001976a9140dfc8bafc8419853b34d5e072ad37d1a5159f58488ac00000000');
    });

    server.post('/decoderawtransaction', (req, res) => {
      res.setHeader('Content-Type', 'application/json');

      let t = BitcoinCash.transaction();
      let decodedTx = t.fromHex(req.body.params[0]);

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

    server.post('/decodescript', (req, res) => {
      res.setHeader('Content-Type', 'application/json');
      // let params = req.body.params;
      // let redeemScript = params[0];
      // let rd = Bitcoin.script.multisig.output.decode(new Buffer(redeemScript, "hex"))
      // console.log(rd);
      // let me = Bitcoin.script.decompile(new Buffer(redeemScript, "hex"));
      // console.log(me);
      // console.log(JSON.parse(JSON.stringify(rd)));

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

    server.post('/disconnectnode', (req, res) => {
      res.setHeader('Content-Type', 'application/json');

      res.send("Node not found in connected nodes");
    });

    server.post('/dumpprivkey', (req, res) =>{
      res.setHeader('Content-Type', 'application/json');

      store.get('addresses').forEach((address, index) => {
        let tmp = BitcoinCash.fromWIF(address.privateKeyWIF).getAddress();
        if(tmp === BitcoinCash.toLegacyAddress(req.body.params[0])) {
          res.send(address.privateKeyWIF);
        }
      });
    });

    server.post('/dumpwallet', (req, res) =>{
      res.setHeader('Content-Type', 'application/json');

      let addresses = [];
      store.get('addresses').forEach(function(address, index) {
        addresses.push(address.privateKeyWIF);
      });
      res.send(addresses);
    });

    server.post('/encryptwallet', (req, res) => {
      res.setHeader('Content-Type', 'application/json');

      res.send("wallet encrypted; Bitcoin server stopping, restart to run with encrypted wallet. The keypool has been flushed, you need to make a new backup.");
    });

    server.post('/estimatefee', (req, res) => {
      res.setHeader('Content-Type', 'application/json');

      let fee;
      if(req.body.params[0] === 1) {
        fee = -1;
      } else {
        fee = '0.00000002';
      }

      res.send(JSON.stringify(fee));
    });

    server.post('/estimatesmartfee', (req, res) => {
      res.setHeader('Content-Type', 'application/json');

      let fee;
      if(req.body.params[0] === 0) {
        fee = {
          "feerate": -1,
          "blocks": 0
        };
      } else {
        fee = {
          "feerate": '0.00000002',
          "blocks": req.body.params[0]
        };
      }

      res.send(JSON.stringify(fee));
    });

    server.post('/estimatesmartpriority', (req, res) => {
      res.setHeader('Content-Type', 'application/json');

      res.send({
          "priority": '-1',
          "blocks": req.body.params[0]
        });
    });

    server.post('/estimatepriority', (req, res) => {
      res.setHeader('Content-Type', 'application/json');

      res.send('-1');
    });

    server.post('/fundrawtransaction', (req, res) => {
      res.setHeader('Content-Type', 'application/json');

      res.send(JSON.stringify({
      	"hex": "01000000011da9283b4ddf8d89eb996988b89ead56cecdc44041ab38bf787f1206cd90b51e0000000000ffffffff01405dc600000000001976a9140dfc8bafc8419853b34d5e072ad37d1a5159f58488ac00000000",
      	"fee": 0.0000245,
      	"changepos": 2
      }));
    });

    server.post('/generate', (req, res) => {
      res.setHeader('Content-Type', 'application/json');

      res.send(JSON.stringify([]));
    });

    server.post('/generatetoaddress', (req, res) => {
      res.setHeader('Content-Type', 'application/json');

      res.send(JSON.stringify([]));
    });

    server.post('/getaccountaddress', (req, res) => {
      res.setHeader('Content-Type', 'application/json');

      res.send(BitcoinCash.toCashAddress(BitcoinCash.fromWIF(store.get('addresses')[0].privateKeyWIF).getAddress()));
    });

    server.post('/getaccount', (req, res) => {
      res.setHeader('Content-Type', 'application/json');

      res.send('');
    });

    server.post('/getaddednodeinfo', (req, res) => {
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

    server.post('/getaddressesbyaccount', (req, res) => {
      res.setHeader('Content-Type', 'application/json');
      let addresses = [];
      store.get('addresses').forEach((address, index) => {
        addresses.push(BitcoinCash.toCashAddress(BitcoinCash.fromWIF(address.privateKeyWIF).getAddress()));
      });
      res.send(addresses);
    });

    server.post('/getbalance', (req, res) => {
      res.setHeader('Content-Type', 'application/json');

      res.send(JSON.stringify('0.00000000'));
    });

    server.post('/getbestblockhash', (req, res) => {
      res.setHeader('Content-Type', 'application/json');

      res.send(JSON.stringify('0000000000075c58ed39c3e50f99b32183d090aefa0cf8c324a82eea9b01a887'));
    });

    server.post('/getblock', (req, res) => {
      res.setHeader('Content-Type', 'application/json');

      res.send(JSON.stringify({ hash: '000000000000000002eafe2494f7dd1f678988217a12e8ab20d3594affd03392',
        confirmations: 1,
        size: 3827,
        height: 518990,
        version: 536870912,
        versionHex: '20000000',
        merkleroot: 'd728487f6b559e46316605e2f4fdb7ff472017a5603c27523a3f41754aabfebf',
        tx:
         [ '887f1545a7fc2dd1af3cd2adacbe387d57ab1868a77b12d324c79f4446f95cb8',
           '8660e931e59db9c37f3f1805e558e5dc2811fb90b5d36fadbcd489e6f0f1e058',
           'ed26deabed91eca37a9df871855e0c29eed14c11ec6964bb4a25dfbfd274f9c7',
           'a59dafb4e76bee152b25924545dbefc932179dcd03f24224dc6e4fc3922df120',
           '3eed0b9964101e1f65796974a1eaf11cf654f2c6d8cde00a507d5b9bc0c519c6',
           'ff10efc734c95a20a96b2dd62f4911b8dffe3c1bf06065c9b54d2d636156cddc',
           '4df121a83914704ed6dd38434a05561de6c733e4ad0b19138c5747bea2d89632',
           '48c66dc7cca2dd6cd54319db19e90dc9203a1a4cf7df7b1c36da1c333dc99a17',
           '2a28269bb4b284b6fde5beb35feda500e4c164ccfe98ddd5611c52b9e5d5072e',
           '95c2f3f6bbb68ec839de0fe66ed2c02a52dab345390b06f014ba66e8372ad654',
           '96c5cb8e5060bc9d177e398acd529a12c7bd18085c5c72d7e20875d3f4a97a5a',
           '0f4e99a3047905b47537a1e7d4c6db34bfb6dcb5c8ba8f52a77a7942283a5a6f',
           '31938cc2db6fd1aa702cc461c53941dcb1895d80a958d689f40737244d67b29a',
           '93a5ac08e4e026fc1ae40b54ed3534bb6d975806aefa84cf6ef67de3d1603be1' ],
        time: 1519595851,
        mediantime: 1519593171,
        nonce: 1942317402,
        bits: '18030655',
        difficulty: 363501276434.3268,
        chainwork: '0000000000000000000000000000000000000000008ac73e431fce0e00d0f62f',
        previousblockhash: '000000000000000002187c90897b518c4da5122dcc42389a6f7461064f3ae7bd'
      }));
    });

    server.post('/getblockchaininfo', (req, res) => {
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

    server.post('/getblockcount', (req, res) => {
      res.setHeader('Content-Type', 'application/json');
      res.send('0');
    });

    server.post('/getblockhash', (req, res) => {
      res.setHeader('Content-Type', 'application/json');
      res.send('00000000a0faf83ab5799354ae9c11da2a2bd6db44058e03c528851dee0a3fff');
    });

    server.post('/getblockheader', (req, res) => {
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

    server.post('/getblocktemplate', (req, res) => {
      res.setHeader('Content-Type', 'application/json');
      res.send(JSON.stringify({ template_request: req.body.params[0] }));
    });

    server.post('/getchaintips', (req, res) => {
      res.setHeader('Content-Type', 'application/json');
      res.send(JSON.stringify([
        {
          "height": 518990,
          "hash": "000000000000000002eafe2494f7dd1f678988217a12e8ab20d3594affd03392",
          "branchlen": 0,
          "status": "active"
        },
        {
          "height": 518349,
          "hash": "000000000000000001e349c5fbc653adcfd87c1a81c0ccc0e7443def968a54e6",
          "branchlen": 1,
          "status": "valid-headers"
        }
      ]));
    });

    server.post('/getconnectioncount', (req, res) => {
      res.setHeader('Content-Type', 'application/json');

      res.send(0);
    });

    server.post('/getdifficulty', (req, res) => {
      res.setHeader('Content-Type', 'application/json');

      res.send(0);
    });

    server.post('/getexcessiveblock', (req, res) => {
      res.setHeader('Content-Type', 'application/json');

      res.send('success');
    });

    server.post('/getinfo', (req, res) => {
      res.setHeader('Content-Type', 'application/json');

      res.send({
        version: 160200,
        protocolversion: 70015,
        walletversion: 130000,
        balance: 0,
        blocks: 518990,
        timeoffset: 0,
        connections: 14,
        proxy: '',
        difficulty: 363501276434.3268,
        testnet: 'false',
        keypoololdest: 1519061617,
        keypoolsize: 100,
        paytxfee: 0,
        relayfee: 0.00001,
        errors: ''
      });
    });

    server.post('/getmemoryinfo', (req, res) => {
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

    server.post('/getmempoolancestors', (req, res) => {
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


    server.post('/getmempooldescendants', (req, res) => {
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

    server.post('/getmempoolentry', (req, res) => {
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

    server.post('/getmempoolinfo', (req, res) => {
      res.setHeader('Content-Type', 'application/json');

      res.send(JSON.stringify({
        "size": 1237,
        "bytes": 591126,
        "usage": 1900416,
        "maxmempool": 300000000,
        "mempoolminfee": 0.00000000
      }));
    });

    server.post('/getmininginfo', (req, res) => {
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

    server.post('/getnettotals', (req, res) => {
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

    server.post('/getnetworkhashps', (req, res) => {
      res.setHeader('Content-Type', 'application/json');

      res.send('2674221725221622000');
    });

    server.post('/getnetworkinfo', (req, res) => {
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
            "address": "0321:2c13::f03c:82ee:fe89:cec2",
            "port": 8333,
            "score": 4
          }
        ],
        "warnings": ""
      }));
    });

    server.post('/getnewaddress', (req, res) => {
      res.setHeader('Content-Type', 'application/json');

      res.send(BitcoinCash.toCashAddress(BitcoinCash.fromWIF(store.get('addresses')[0].privateKeyWIF).getAddress()));
    });

    server.post('/getpeerinfo', (req, res) => {
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

    server.post('/getrawchangeaddress', (req, res) => {
      res.setHeader('Content-Type', 'application/json');

      res.send(BitcoinCash.toCashAddress(BitcoinCash.fromWIF(store.get('addresses')[0].privateKeyWIF).getAddress()));
    });

    server.post('/getrawmempool', (req, res) => {
      res.setHeader('Content-Type', 'application/json');

      res.send(JSON.stringify([
      '6d23328804d12b8fc9a7cacf41eee9272ac5648ef209deefffacba2c31d13375',
      '6a0377bf00d68cf8a8623f9b7f43eecd7c26a2057184d93f208dd4a31923efb6',
      '5fc6fbde91aaeab8feb4fd3f8c9c1da7d157a5368e759ed4dd349924aefebae1',
      'e079e017b2766adf8bea6bd7f5d50c09069cfc9f1424e5c40974d04561bd3e6d',
      '003fd0ee7178899ec845e3aa534eef47077734d731ced213871e7eb5b00d8a69',
      'd524d2ce8982d8af9127fd1285c2a2a3aca88b3a3c46bab04db2a9aacfc4add5',
      '96d1dc2412478b27d98fff2f4b87d15fb376c2422cb077380c0a5203d5228793',
      '1a54518db78cd3533653828b918da3f566f5512b8a039d6f22972f67f87cf844',
      'e0b1ea4287c6a2829300a150d56c319bc1f24b4966d2405e613c778de6751c5f',
      'f366b36c74361af7d5d0ba24b0f1355e104c16fd9a8b5f38be52418125aeea9a',
      'b496b4b01d9a0880c1b5e6278e843c38799a4fd2bb34e7a62a1a56f68a7300b5',
      'd40ff3e30231a825345e9530ba854e53cc052f8e20610f92f9d964cf00954b14',
      'f86e3c20649cc374ece1aeaaf6e9e20cc361b4ad7236af7af930643edb45d708',
      '1c93544c126f9814d81c1e68146e24b7b1e286c3a03cf2e25e30f60c483d6063',
      '0176fcaa8cdd90f6ecad9b37597290bbb5b1465a9041d796700865a2eb0fc2a9',
      '771326755f3a15a38947ccaf1142d8928df2d3cde88641c7fedd2fb8a85b90cc',
      '99c1efc61a96293cc26d6db6d35a29af0dae216d630a697e58bf6ab78eb5b59f',
      '5d2adf9d822e56e5c308bffb37ce07992e6943c1ac900f783ff290942915afda',
      'f3ca3a4771aedb68249be75f6e004c509bebdb0d532108e1b8c745790c7589b8',
      '03d863b378fb088847138d6b5f9d022b0f99a679931eb23dd176a322c0e295ae',
      'b22a6b9ba8d4a5122db6b6c79abd16a751ff85fd2958303ba2cfebe9bac280ac',
      '5c746c206b631a87e3920ea7dc3378a710176bcf995f6b7e423a64f577b95398',
      '2ee43bc6061341550bb19e2e0c6a700ce21bfd438a37cd3f3acfed65870fca81',
      '1e0a1c06881f16a02c630f57989a6a9571ed90843057220ce20dbba656f8be76',
      'b532b4679627ef49c5c28de91c762b59f8031a0033eec828b1f7fd3c134d3766',
      '4a6a42c2153fa4a6a70de7f09fdee766d9ceeb7a6dbe1a1495a17529f6364533',
      '4e975f1d36ff8779f0b54713bac96d851002cca16f3dab2a0819fe2b78651b2b',
      '004a6661ba3f31797e0f868d9465f63ab1e0041d15756467ba7eaccfe49b261a',
      'de856283ed5f9c39a5a89f6fb051b7ab23f740331874bf88973ba2d734374feb',
      '9490b1dfa731baa7a22348d676edd73bb89930defe6942fe032330a72c567dd8',
      '1a567bed7bb50a69c9d7c66335c0cf97ea2553389f51c241fb2278ba46e4191d',
      '32fb9dd3be9b14ab33cbee95b6581e08ac1456398d1978dd960ec18e06c317e6',
      'a26486de58c5a177925f8deb0f321830a083e545c8b6804dd77178a116ba3f13',
      '60448fbeaf1a828b211fb826872ba33101f83cbbb8224a5c358975950bb5ef9e',
      '43a77e7c4ac422a4bccca48af0cf00b3a12de0f733688afe7e6761a5a0d3b484',
      '87a282d846d2da4ba0bd94ff1026e04b90b0394cb104dafb402ef1b2ccba438f',
      'aa64c0a1524c50df79795da399a558140374f664bc84f75729d43f10c349216a',
      '435370286caac236dc9c932d14d85de97211ae6b26b1bdf955e58b28d2713729',
      'f5d2846674b0ee4afc9c1332c883f5a7d7474a235ee7eccc0b9b8121aa4bbbf0',
      '3738c0057952171a38b9a4346273b34e73815a9e8c6e1a47c8775711415684a4',
      '5201e0f597c7b84763678045daad7a044c86a8ee9c6de0279d498c1cbebc9196',
      '1d735e242e76b69aa6c1b4c906196323b76f98a9680325419864239081c277e5',
      '623ac97e2581ee9defaa5bef1869b1361cce4124189d80592d9497811f3aa14c',
      '4dfb66bb6736635d4390608cf42fb6c2be618ce4a82f00a34d339631ee9a85b8',
      'fbad10410a13231de058aa5a713b65356463a03a4693eb91513205f98b91b8f1',
      'ac6a49017af73aa237e35319e5fb2a2989673f5dae30d866abe6456f2b5858ed',
      'cdb53985b723edcad2ad111b264ae7289f5c21462dba305e334144bd70eaa2e1',
      'c280ab5f909c9483ab9999c4c72040c8822fe1f49b769dc69190a8e98316d3a8',
      'c3a2c58ca679fa73805b000c12589d00e7b1fbe92ee15fb1cf90be352c8fd865',
      '755c9f91eeb95df7ce6eab1ac3a48c0d13f5f6ac5c8d90d3b6d47c131ec73614',
      'f0048a1cc7bf365651b5905b30c174d4380187b168dbb96ee24194f74a72130d',
      '605a0cdd75a67caf6c8d06c855c7d48828d8e4c0f145d764d3bc5d85a26ad904',
      '7854ee4e9984c195e1a5f512e621df4be79f7274d2784030c2d94e37f215eb19'
      ]));
    });

    server.post('/getrawtransaction', (req, res) => {
      res.setHeader('Content-Type', 'application/json');
      let resp;
      if(req.body.params[1] && req.body.params[1] == true) {
        resp = {
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
        };
      } else {
        resp = '0200000002b0e5d57d7ceb9329622792eb77d68971527a27dbd164f83c31f232b300b2ce40000000006a47304402205a6b937be935b7ef3c7507e65ac34f8466551c52be62c4eb0cc9c3232ed42b6202205ba4b7b76c05e5f2a10f74086257950df12ab2fc046e9d8e42304eeb791aff2041210338e9690b132d13a209dd5d549e21da1fee5fd8b391a9a183bb643f3fef6db110ffffffff681bc3b7293b887eeba19beaab30765ec2b16712d9df5c153d38988973cb05c9000000006b483045022100eb8136cbecccf125021c13fc953e6d669d41842f189a69f2060d7b4e5bbeba380220331642c3de3e1b016a0bfff0aa9c3a45b19078aa571ed10d90254137b87e6dd84121028a91bd260272d6e05845f602386ef744ecd8ffb15b68933e59c27ca1637bc911ffffffff02f8240100000000001976a914b0ef8fc1b127ac562ed8158cd11b7ed261b28bab88acd5be3e0f000000001976a914efb008ccec12d06248b33b38df962290673f8f3788ac00000000';

      }

      res.send(JSON.stringify(resp));
    });

    server.post('/getreceivedbyaccount', (req, res) => {
      res.setHeader('Content-Type', 'application/json');

      res.send('0.00000000');
    });

    server.post('/getreceivedbyaddress', (req, res) => {
      res.setHeader('Content-Type', 'application/json');

      res.send('0.00000000');
    });

    server.post('/gettransaction', (req, res) => {
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

    server.post('/gettxout', (req, res) => {
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

    server.post('/gettxoutproof', (req, res) => {
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

    server.post('/gettxoutsetinfo', (req, res) => {
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

    server.post('/getunconfirmedbalance', (req, res) => {
      res.setHeader('Content-Type', 'application/json');

      res.send('0.00000000');
    });

    server.post('/getwalletinfo', (req, res) => {
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

    server.post('/help', (req, res) => {
      res.setHeader('Content-Type', 'application/json');

      res.send('https://www.youtube.com/watch?v=ZNahS3OHPwA');
    });

    server.post('/importaddress', (req, res) => {
      res.setHeader('Content-Type', 'application/json');

      res.send(JSON.stringify({ result: null }));
    });

    server.post('/importmulti', (req, res) => {
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

    server.post('/importprivkey', (req, res) => {
      res.setHeader('Content-Type', 'application/json');

      res.send(JSON.stringify({ result: null }));
    });

    server.post('/importprunedfunds', (req, res) => {
      res.setHeader('Content-Type', 'application/json');

      res.send(JSON.stringify({ result: null }));
    });

    server.post('/importwallet', (req, res) => {
      res.setHeader('Content-Type', 'application/json');

      res.send(JSON.stringify({ result: null }));
    });

    server.post('/keypoolrefill', (req, res) => {
      res.setHeader('Content-Type', 'application/json');

      res.send(JSON.stringify({ result: null }));
    });

    server.post('/listaccounts', (req, res) => {
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

    server.post('/listaddressgroupings', (req, res) => {
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

    server.post('/listbanned', (req, res) => {
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

    server.post('/listlockunspent', (req, res) => {
      res.setHeader('Content-Type', 'application/json');

      res.send(JSON.stringify([
          {
              "txid" : "ca7cb6a5ffcc2f21036879493db4530c0ce9b5bff9648f9a3be46e2dfc8e0166",
              "vout" : 0
          }
      ]));
    });

    server.post('/listreceivedbyaccount', (req, res) => {
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

    server.post('/listreceivedbyaddress', (req, res) => {
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

    server.post('/listsinceblock', (req, res) => {
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

    server.post('/listtransactions', (req, res) => {
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

    server.post('/listunspent', (req, res) => {
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

    server.post('/lockunspent', (req, res) => {
      res.setHeader('Content-Type', 'application/json');

      res.send(true);
    });

    server.post('/move', (req, res) => {
      res.setHeader('Content-Type', 'application/json');

      res.send(true);
    });

    server.post('/ping', (req, res) => {
      res.setHeader('Content-Type', 'application/json');

      res.send(JSON.stringify(null));
    });

    server.post('/preciousblock', (req, res) => {
      res.setHeader('Content-Type', 'application/json');

      res.send(JSON.stringify(null));
    });

    server.post('/prioritisetransaction', (req, res) => {
      res.setHeader('Content-Type', 'application/json');

      res.send(true);
    });

    server.post('/pruneblockchain', (req, res) => {
      res.setHeader('Content-Type', 'application/json');

      res.send('success');
    });

    server.post('/removeprunedfunds', (req, res) => {
      res.setHeader('Content-Type', 'application/json');

      res.send(JSON.stringify(null));
    });

    server.post('/sendfrom', (req, res) => {
      res.setHeader('Content-Type', 'application/json');

      res.send('f14ee5368c339644d3037d929bbe1f1544a532f8826c7b7288cb994b0b0ff5d8');
    });

    server.post('/sendmany', (req, res) => {
      res.setHeader('Content-Type', 'application/json');

      res.send('ec259ab74ddff199e61caa67a26e29b13b5688dc60f509ce0df4d044e8f4d63d');
    });

    server.post('/sendrawtransaction', (req, res) => {
      res.setHeader('Content-Type', 'application/json');

      res.send('f5a5ce5988cc72b9b90e8d1d6c910cda53c88d2175177357cc2f2cf0899fbaad');
    });

    server.post('/sendtoaddress', (req, res) => {
      res.setHeader('Content-Type', 'application/json');

      res.send('a2a2eb18cb051b5fe896a32b1cb20b179d981554b6bd7c5a956e56a0eecb04f0');
    });

    server.post('/setaccount', (req, res) => {
      res.setHeader('Content-Type', 'application/json');

      res.send(JSON.stringify(null));
    });

    server.post('/setban', (req, res) => {
      res.setHeader('Content-Type', 'application/json');

      res.send(JSON.stringify(null));
    });

    server.post('/setexcessiveblock', (req, res) => {
      res.setHeader('Content-Type', 'application/json');

      res.send('success');
    });

    server.post('/setnetworkactive', (req, res) => {
      res.setHeader('Content-Type', 'application/json');

      res.send(JSON.stringify(null));
    });

    server.post('/settxfee', (req, res) => {
      res.setHeader('Content-Type', 'application/json');

      res.send(true);
    });

    server.post('/signmessage', (req, res) => {
      res.setHeader('Content-Type', 'application/json');
      let address = req.body.params[0];

      let privateKeyWIF = BitcoinCash.returnPrivateKeyWIF(address, store.get('addresses'));

      if(privateKeyWIF === undefined) {
        res.send("BITBOX doesn't have the private key for that address");
        return false;
      } else if(privateKeyWIF === 'Received an invalid Bitcoin Cash address as input.') {
        res.send(privateKeyWIF);
        return false;
      }

      let message = req.body.params[1];
      let signature = BitcoinCash.signMessage(message, privateKeyWIF);
      res.send(signature.toString('base64'));
    });

    server.post('/signmessagewithprivkey', (req, res) => {
      res.setHeader('Content-Type', 'application/json');

      let privateKeyWIF = req.body.params[0];
      let signature = BitcoinCash.signMessage(req.body.params[1], privateKeyWIF);
      res.send(signature.toString('base64'));
    });


    server.post('/signrawtransaction', (req, res) => {
      res.setHeader('Content-Type', 'application/json');

      res.send(JSON.stringify({
          "hex" : "01000000011da9283b4ddf8d89eb996988b89ead56cecdc44041ab38bf787f1206cd90b51e000000006a47304402200ebea9f630f3ee35fa467ffc234592c79538ecd6eb1c9199eb23c4a16a0485a20220172ecaf6975902584987d295b8dddf8f46ec32ca19122510e22405ba52d1f13201210256d16d76a49e6c8e2edc1c265d600ec1a64a45153d45c29a2fd0228c24c3a524ffffffff01405dc600000000001976a9140dfc8bafc8419853b34d5e072ad37d1a5159f58488ac00000000",
          "complete" : true
      }));
    });

    server.post('/stop', (req, res) => {
      res.setHeader('Content-Type', 'application/json');

      res.send('Bitcoin server stopping');
    });

    server.post('/submitblock', (req, res) => {
      res.setHeader('Content-Type', 'application/json');

      res.send(JSON.stringify(null));
    });

    server.post('/validateaddress', (req, res) => {
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

    server.post('/verifychain', (req, res) => {
      res.setHeader('Content-Type', 'application/json');

      res.send(true);
    });

    server.post('/verifymessage', (req, res) => {
      res.setHeader('Content-Type', 'application/json');
      let address;
      let verified;
      try {
        address = BitcoinCash.toLegacyAddress(req.body.params[0]);
      }
      catch (e) {
        address = e.message;
      }
      if(address === 'Received an invalid Bitcoin Cash address as input.') {
        res.send(address);
        return false;
      }

      try {
        verified = BitcoinCash.verifyMessage(req.body.params[2], address, req.body.params[1])
      }
      catch (e) {
        verified = e.message;
      }
      res.send(verified);
    });

    server.post('/verifytxoutproof', (req, res) => {
      res.setHeader('Content-Type', 'application/json');

      res.send(JSON.stringify([
      "f20e44c818ec332d95119507fbe36f1b8b735e2c387db62adbe28e50f7904683"
      ]));
    });

    server.post('/walletlock', (req, res) => {
      res.setHeader('Content-Type', 'application/json');

      res.send(JSON.stringify(null));
    });

    server.post('/walletpassphrase', (req, res) => {
      res.setHeader('Content-Type', 'application/json');

      res.send(JSON.stringify(null));
    });
    server.post('/walletpassphrasechange', (req, res) => {
      res.setHeader('Content-Type', 'application/json');

      res.send(JSON.stringify(null));
    });

    server.listen(port, () => {console.log('listening on port 8332,')});
  }
}

export default Server;
