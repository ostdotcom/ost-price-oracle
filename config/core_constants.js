"use strict";

const path = require('path')
    , rootPrefix = ".."
    , InstanceComposer = require( rootPrefix + "/instance_composer")
  ;


/**
 * Constructor for core constants
 *
 * @constructor
 */
const CoreConstants = function ( configStrategy, instanceComposer) {
  const oThis = this;

  oThis['CACHING_ENGINE']                 = configStrategy.OST_CACHING_ENGINE ;
  oThis['OST_UTILITY_GETH_RPC_PROVIDER']  = configStrategy.OST_UTILITY_GETH_RPC_PROVIDER;
  oThis['OST_UTILITY_GETH_WS_PROVIDER']   = configStrategy.OST_UTILITY_GETH_WS_PROVIDER;

  if (configStrategy.OST_UTILITY_PRICE_ORACLES != undefined &&
      configStrategy.OST_UTILITY_PRICE_ORACLES != '' &&
      configStrategy.OST_UTILITY_PRICE_ORACLES != null) {
      oThis['OST_UTILITY_PRICE_ORACLES'] = JSON.parse( configStrategy.OST_UTILITY_PRICE_ORACLES );
  }

  oThis['DEBUG_ENABLED'] = configStrategy.OST_DEBUG_ENABLED ;
};

CoreConstants.prototype = {

  // Cache engine
  CACHING_ENGINE: null ,

  // OST PO Gas LIMIT
  OST_UTILITY_GAS_LIMIT: 4700000,

  // Chain Geth Provider
  OST_UTILITY_GETH_RPC_PROVIDER: null,
  OST_UTILITY_GETH_WS_PROVIDER : null,

  // Define Price Oracles
  OST_UTILITY_PRICE_ORACLES: null,

  // debug log level.
  DEBUG_ENABLED : null
};

InstanceComposer.register(CoreConstants, "getCoreConstants", true);

module.exports = CoreConstants;



