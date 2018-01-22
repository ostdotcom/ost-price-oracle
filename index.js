/**
 * Index File of ost-price-oracle node module
 */

"use strict";

const rootPrefix = "."
  , version = require(rootPrefix + '/package.json').version

const OSTPriceOracle = function () {
  const oThis = this;

  oThis.version = version;
};

module.exports = OSTPriceOracle;