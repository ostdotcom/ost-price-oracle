"use strict";

const rootPrefix = '../../..'
  ,coreConstants = require(rootPrefix + '/config/core_constants');

const Web3 = require('web3')
  , web3WSProvider = new Web3(coreConstants.OST_UTILITY_GETH_WS_PROVIDER);

console.log("web3WSProvider: ", coreConstants.OST_UTILITY_GETH_WS_PROVIDER);
module.exports = web3WSProvider;
