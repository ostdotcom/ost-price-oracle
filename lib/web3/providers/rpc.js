"use strict";

const OSTBase = require("@openstfoundation/openst-base");

const rootPrefix = '../../..'
    , InstanceComposer = require( rootPrefix + "/instance_composer")
;

require(rootPrefix + '/config/core_constants');

const Web3RpcProvider = function ( configStrategy, instanceComposer ) {
  const oThis = this ,
        coreConstants = instanceComposer.getCoreConstants(),
        OstWeb3       = OSTBase.OstWeb3
  ;
  Web3RpcProvider.prototype =  new OstWeb3(coreConstants.OST_UTILITY_GETH_RPC_PROVIDER);
};

InstanceComposer.register(Web3RpcProvider, "getWeb3RpcProvider", true);

module.exports = Web3RpcProvider;