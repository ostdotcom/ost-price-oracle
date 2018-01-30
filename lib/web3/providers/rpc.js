"use strict";

const coreConstants = require('../../../config/core_constants');

const Web3 = require('web3')
  , web3RpcProvider = new Web3(coreConstants.OST_PO_GETH_RPC_PROVIDER);

module.exports = web3RpcProvider;
