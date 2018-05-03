import BitcoinCash from './BitcoinCash'
import Bitcoin from 'bitcoinjs-lib';

import Store from 'electron-store';
const store = new Store();

import express from 'express';
import cors from 'cors';

import axios from 'axios';
import bodyParser from 'body-parser';
let BITBOXCli = require('bitbox-cli/lib/bitboxcli').default;
let bitbox = new BITBOXCli();
import underscore from 'underscore';

class Server {
  constructor() {
    const server = express();
    let protocol = 'http';
    let ipAddress = '127.0.0.1';
    let port = 8332;
    server.use(cors());
    server.use(bodyParser.json()); // support json encoded bodies
    server.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies
    server.post('/', (req, res) => {
      res.setHeader('Content-Type', 'application/json');
      axios.post(`${protocol}://${ipAddress}:${port}/${req.body.method}`, req.body)
      .then((response) => {
        res.send({
          result: response.data
        });
      })
      .catch((error) => {
        res.send(error);
      });
    });

    server.get('/decodeScript/:hex', (req, res) => {
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

    server.get('/getAddedNodeInfo', (req, res) => {
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

    server.get('/getBestBlockHash', (req, res) => {
      res.setHeader('Content-Type', 'application/json');
      let bestblock = underscore.last(store.get('state').blockchain.chain);

      res.send(JSON.stringify(bestblock.header));
    });

    server.get('/getBlock/:hash', (req, res) => {
      res.setHeader('Content-Type', 'application/json');
      let blockchain = store.get('state').blockchain;
      let block = underscore.findWhere(blockchain.chain, {header: req.body.params[0]});

      res.send(JSON.stringify(block));
    });

    server.get('/getBlockchainInfo', (req, res) => {
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

    server.get('/getBlockCount', (req, res) => {
      res.setHeader('Content-Type', 'application/json');
      let blockCount = store.get('state').blockchain.chain.length;
      res.send(JSON.stringify(blockCount));
    });

    server.get('/getBlockHash/:height', (req, res) => {
      res.setHeader('Content-Type', 'application/json');
      let blockchain = store.get('state').blockchain;
      let block = underscore.findWhere(blockchain.chain, {index: +req.body.params[0]});

      res.send(block ? block.header : 'n/a');
    });

    server.get('/getBlockHeader/:hash', (req, res) => {
      res.setHeader('Content-Type', 'application/json');
      let blockchain = store.get('state').blockchain;
      let block = underscore.findWhere(blockchain.chain, {header: req.body.params[0]});

      res.send(block ? block.header : 'n/a');
    });

    server.get('/getBlockTemplate', (req, res) => {
      res.setHeader('Content-Type', 'application/json');
      res.send(JSON.stringify({ template_request: req.body.params[0] }));
    });

    server.get('/getChainTips', (req, res) => {
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

    server.get('/getConnectionCount', (req, res) => {
      res.setHeader('Content-Type', 'application/json');

      res.send('success');
    });

    server.get('/getDifficulty', (req, res) => {
      res.setHeader('Content-Type', 'application/json');

      res.send(JSON.stringify('0'));
    });

    server.get('/getInfo', (req, res) => {
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

    server.get('/getMemoryInfo', (req, res) => {
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

    server.post('/ping', (req, res) => {
      res.setHeader('Content-Type', 'application/json');

      res.send(JSON.stringify(null));
    });

    server.post('/preciousblock', (req, res) => {
      res.setHeader('Content-Type', 'application/json');

      res.send(JSON.stringify(null));
    });

    server.post('/pruneblockchain', (req, res) => {
      res.setHeader('Content-Type', 'application/json');

      res.send('success');
    });

    server.post('/sendrawtransaction', (req, res) => {
      res.setHeader('Content-Type', 'application/json');

      res.send('f5a5ce5988cc72b9b90e8d1d6c910cda53c88d2175177357cc2f2cf0899fbaad');
    });

    server.post('/signmessage', (req, res) => {
      res.setHeader('Content-Type', 'application/json');
      let state = store.get('state');
      let accounts = state.wallet.accounts;
      let address = req.body.params[0];

      let privateKeyWIF = BitcoinCash.returnPrivateKeyWIF(address, accounts);

      if(privateKeyWIF === undefined) {
        res.send("BITBOX doesn't have the private key for that address");
        return false;
      } else if(privateKeyWIF === 'Received an invalid Bitcoin Cash address as input.') {
        res.send(privateKeyWIF);
        return false;
      }

      let message = req.body.params[1];
      let signature = bitbox.BitcoinCash.signMessageWithPrivKey(privateKeyWIF, message);
      res.send(signature);
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

    server.post('/verifytxoutproof', (req, res) => {
      res.setHeader('Content-Type', 'application/json');

      res.send(JSON.stringify([
      "f20e44c818ec332d95119507fbe36f1b8b735e2c387db62adbe28e50f7904683"
      ]));
    });

    server.listen(port, () => {console.log('listening on port 8332,')});
  }
}

export default Server;
