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

// OST PO Gas LIMIT
define('OST_UTILITY_GAS_LIMIT', 4700000);

// Chain Geth Provider
define('OST_UTILITY_GETH_RPC_PROVIDER', process.env.OST_UTILITY_GETH_RPC_PROVIDER);

// Define Price Oracles
if (process.env.OST_UTILITY_PRICE_ORACLES != undefined || process.env.OST_UTILITY_PRICE_ORACLES != '') {
  define('OST_UTILITY_PRICE_ORACLES', JSON.parse(process.env.OST_UTILITY_PRICE_ORACLES));
}

