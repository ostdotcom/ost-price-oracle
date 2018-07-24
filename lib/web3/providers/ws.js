"use strict";

const OSTBase = require("@openstfoundation/openst-base");
const rootPrefix = '../../..'
  , InstanceComposer = require( rootPrefix + "/instance_composer")
;
require(rootPrefix + '/config/core_constants');
const Web3WSProvider = function () {
  const oThis = this
      , coreConstants = oThis.ic().getCoreConstants()
      , OstWeb3       = OSTBase.OstWeb3
  ;
  Web3WSProvider.prototype = new OstWeb3(coreConstants.OST_UTILITY_GETH_WS_PROVIDER, null, {
    providerOptions: {
      maxReconnectTries: 20,
      killOnReconnectFailure: false
    }
  });
};


InstanceComposer.register(Web3WSProvider, "getWeb3WSProvider", true);
module.exports = Web3WSProvider;
