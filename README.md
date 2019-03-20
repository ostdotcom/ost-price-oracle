# OST Price Oracle

[![Latest version](https://img.shields.io/npm/v/@ostdotcom/ost-price-oracle.svg?maxAge=3600)](https://www.npmjs.com/package/@ostdotcom/ost-price-oracle)
[![Build Status](https://travis-ci.org/ostdotcom/ost-price-oracle.svg?branch=develop)](https://travis-ci.org/ostdotcom/ost-price-oracle)
[![Downloads per month](https://img.shields.io/npm/dm/@ostdotcom/ost-price-oracle.svg?maxAge=3600)](https://www.npmjs.com/package/@ostdotcom/ost-price-oracle)

##  Setup
This library assumes that nodejs and geth are installed and running. To install ost-price-oracle in your project using npm:

```bash
npm install @ostdotcom/ost-price-oracle --save
```

## Deploying contract and setting addresses in contract.

### Constants

Before deploying contracts, please set some constants to funded addresses that you control.

```js

// Initialize web3 object using the geth endpoint
const Web3 = require('web3');
const Tx = require('ethereumjs-tx');
const Web3Util = require('web3-utils');
const web3Provider = new Web3('http://127.0.0.1:8545');
const auxChainId = 2001;
const baseCurrency = 'OST';
const quoteCurrency = 'USD';
// Owner address.
const ownerAddress = '0xAb_______';
// Owner private key.
const ownerPrivateKey = '00_______';
// Worker address.
const workerAddress = '0xAb_______';
// Admin address.
const adminAddress = '0xAb_______';

```

### Deploy Price Oracle contract

```js
const DeployAndSetOpsAndAdminHelper = require('./index').DeployAndSetOpsAndAdminHelper;
const deployAndSetOpsAndAdminHelper = new DeployAndSetOpsAndAdminHelper();
// Prepare txOptions.
const txOptions = {
  gasPrice: '0x0', // Set this value according to your chain gas price.
  gas: Web3Util.toHex(650000),
  chainId: Number(auxChainId),
  value: '0x0',
  nonce: 0
};
// Get raw transaction object.
const txObject = deployAndSetOpsAndAdminHelper.deployRawTx(
  web3Provider,
  ownerAddress,
  baseCurrency,
  quoteCurrency,
  txOptions
);
txOptions.data = txObject.encodeABI();
const privateKeyObj = new Buffer.from(ownerPrivateKey, 'hex'); // Prepare transaction object.
const tx = new Tx(txOptions);
tx.sign(privateKeyObj);
const serializedTx = tx.serialize();
const signedTransaction = '0x' + serializedTx.toString('hex');
let priceOracleContractAddress;
// Submit transaction on geth.
const transactionReceipt = web3Provider.eth.sendSignedTransaction(signedTransaction)
.then(function(transactionReceipt){
  console.log("Price oracle contract deployed successfully.");
  priceOracleContractAddress = transactionReceipt.contractAddress;
})
.catch(function(err) {
  console.log("Faced an error while deploying contract. Error: ", err);
});

```

### Set ops address in price oracle contract.

```js
const DeployAndSetOpsAndAdminHelper = require('./index').DeployAndSetOpsAndAdminHelper;
const deployAndSetOpsAndAdminHelper = new DeployAndSetOpsAndAdminHelper();
// Prepare txOptions.
const txOptions = {
  gasPrice: '0x0', // Set this value according to your chain gas price.
  gas: Web3Util.toHex(60000),
  chainId: Number(auxChainId),
  value: '0x0',
  nonce: 1
};
// Get raw transaction object.
const txObject = deployAndSetOpsAndAdminHelper.setOpsAddressTx(
  web3Provider,
  workerAddress,
  priceOracleContractAddress,
  txOptions
);
txOptions['data'] = txObject.encodeABI();
const privateKeyObj = new Buffer.from(ownerPrivateKey, 'hex'); // Prepare transaction object.
const tx = new Tx(txOptions);
tx.sign(privateKeyObj);
const serializedTx = tx.serialize();
const signedTransaction = '0x' + serializedTx.toString('hex');
// Submit transaction on geth.
const transactionReceipt = web3Provider.eth.sendSignedTransaction(signedTransaction)
.then(console.log("Ops address set successfully in the contract."))
.catch(function(err) {
  console.log("Faced an error while setting ops address in contract. Error: ", err);
});

```

### Set admin address in price oracle contract.

```js
const DeployAndSetOpsAndAdminHelper = require('./index').DeployAndSetOpsAndAdminHelper;
const deployAndSetOpsAndAdminHelper = new DeployAndSetOpsAndAdminHelper();
// Prepare txOptions.
const txOptions = {
  gasPrice: '0x0', // Set this value according to your chain gas price.
  gas: Web3Util.toHex(60000),
  chainId: Number(auxChainId),
  value: '0x0',
  nonce: 2
};
// Get raw transaction object.
const txObject = deployAndSetOpsAndAdminHelper.setAdminAddressTx(
  web3Provider,
  adminAddress,
  priceOracleContractAddress,
  txOptions
);
txOptions['data'] = txObject.encodeABI();
const privateKeyObj = new Buffer.from(ownerPrivateKey, 'hex'); // Prepare transaction object.
const tx = new Tx(txOptions);
tx.sign(privateKeyObj);
const serializedTx = tx.serialize();
const signedTransaction = '0x' + serializedTx.toString('hex');
// Submit transaction on geth.
const transactionReceipt = web3Provider.eth.sendSignedTransaction(signedTransaction)
.then(console.log("Ops address set successfully in the contract."))
.catch(function(err) {
  console.log("Faced an error while setting ops address in contract. Error: ", err);
});

```

## Calling contract methods.

### Constants

Before calling contract methods, please set some constants.

```js

// Initialize web3 object using the geth endpoint
const Web3 = require('web3');
const Tx = require('ethereumjs-tx');
const Web3Util = require('web3-utils');
const web3Provider = new Web3('http://127.0.0.1:8545');
const auxChainId = 2001;
const baseCurrency = 'OST';
const quoteCurrency = 'USD';
// Worker address.
const workerAddress = '0xAb61FEa23744DA08A711B5B53c272ef19_______';
// Worker private key.
const workerPrivateKey = '008d022f7980d780d8b07a251a4ec580db77ec8f44878a8ebacb0d8f9_______';
// Price oracle contract address.
const priceOracleContractAddress = '0xAb61FEa23744DA08A711B5B53c272ef19_______';

```

### Set price in contract.

```js
const PriceOracleHelper = require('./index').PriceOracleHelper;
const priceInWei = '27596633800000000';
const gasPrice = '0x0'; // Set this value according to your chain gas price.
// Get transaction object.
const txResponse = new PriceOracleHelper(web3Provider).setPriceTx(
  web3Provider,
  baseCurrency,
  quoteCurrency,
  priceOracleContractAddress,
  priceInWei,
  gasPrice
);
// Prepare params for transaction.
const encodedABI = txResponse.encodedABI;
const txParams = {
    from: workerAddress,
    to: priceOracleContractAddress,
    value: '0x0',
    data: encodedABI,
    gas: Web3Util.toHex(80000),
    gasPrice: gasPrice,
    chainId: Number(auxChainId),
    nonce: 0
  };
// Prepare transaction object.
const privateKeyObj = new Buffer.from(workerPrivateKey, 'hex');
const tx = new Tx(txParams);
tx.sign(privateKeyObj);
const serializedTx = tx.serialize();
const signedTransaction = '0x' + serializedTx.toString('hex');
// Submit transaction on geth.
web3Provider.eth.sendSignedTransaction(signedTransaction)
.then(console.log("Price set successfully in contract."))
.catch(function(err) {
  console.log("Price was not set in contract. Error: ", err);
})
```

### Get price from contract.

```js
new PriceOracleHelper(web3Provider).getPrice(web3Provider, priceOracleContractAddress)
.then(function(price) {
  console.log("Price fetched from contract is: ", price);
})
.catch(function(err) {
  console.log("Could not fetch price from contract. Error: ", err);
})
```

### Get quote currency from contract.

```js
new PriceOracleHelper(web3Provider).getQuoteCurrency(web3Provider, priceOracleContractAddress)
.then(function(quoteCurrency) {
  console.log("Quote currency fetched from contract is: ", quoteCurrency);
})
.catch(function(err) {
  console.log("Could not fetch quote currency from contract. Error: ", err);
})
```

### Get base currency from contract.

```js
new PriceOracleHelper(web3Provider).getBaseCurrency(web3Provider, priceOracleContractAddress)
.then(function(baseCurrency) {
  console.log("Base currency fetched from contract is: ", baseCurrency);
})
.catch(function(err) {
  console.log("Could not fetch base currency from contract. Error: ", err);
})
```
