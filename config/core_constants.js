"use strict";

const path = require('path')
  , rootPrefix = ".."
  ;

/*
 * Constants file: Load constants from environment variables
 *
 */

function define(name, value) {
  Object.defineProperty(exports, name, {
    value: value,
    enumerable: true
  });
}

// Cache engine
define('CACHING_ENGINE', process.env.OST_CACHING_ENGINE);

// OST PO Gas LIMIT
define('OST_UTILITY_GAS_LIMIT', 4700000);

// Chain Geth Provider
define('OST_UTILITY_GETH_RPC_PROVIDER', process.env.OST_UTILITY_GETH_RPC_PROVIDER);
define('OST_UTILITY_GETH_WS_PROVIDER', process.env.OST_UTILITY_GETH_WS_PROVIDER);

// Define Price Oracles
if (process.env.OST_UTILITY_PRICE_ORACLES != undefined &&
      process.env.OST_UTILITY_PRICE_ORACLES != '' &&
      process.env.OST_UTILITY_PRICE_ORACLES != null) {
  define('OST_UTILITY_PRICE_ORACLES', JSON.parse(process.env.OST_UTILITY_PRICE_ORACLES));
}

