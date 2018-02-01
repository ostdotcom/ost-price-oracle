/**
 * Index File of ost-price-oracle node module
 */

"use strict";

const rootPrefix = "."
  , version = require(rootPrefix + '/package.json').version
  , priceOracle = require(rootPrefix + '/lib/contract_interact/price_oracle')
  ;

const OSTPriceOracle = function () {
  const oThis = this;

  oThis.version = version;
  oThis.priceOracle = priceOracle;
};

module.exports = new OSTPriceOracle();