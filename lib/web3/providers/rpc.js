"use strict";

const rootPrefix = '../../..'
  ,coreConstants = require(rootPrefix + '/config/core_constants');

const Web3 = require('web3')
  , web3RpcProvider = new Web3(coreConstants.OST_UTILITY_GETH_RPC_PROVIDER);
console.log("web3RpcProvider: ", coreConstants.OST_UTILITY_GETH_RPC_PROVIDER);
module.exports = web3RpcProvider;
