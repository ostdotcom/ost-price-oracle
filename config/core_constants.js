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

// OST Gas Price
define("OST_GAS_PRICE", process.env.OST_GAS_PRICE);
// OST Gas LIMIT
define('OST_GAS_LIMIT', process.env.OST_GAS_LIMIT);

// Chain Geth Provider
define('OST_GETH_RPC_PROVIDER', process.env.OST_GETH_RPC_PROVIDER);

