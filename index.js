'use strict';
/**
 * Index for ost-price-oracle
 *
 * @module index
 */
const rootPrefix = '.',
  AbiBinProvider = require(rootPrefix + '/lib/AbiBinProvider'),
  PriceOracleHelper = require(rootPrefix + '/lib/helpers/setup/PriceOracle'),
  DeployAndSetOpsAndAdminHelper = require(rootPrefix + '/lib/helpers/setup/DeployAndSetOpsAndAdmin');

module.exports = {
  AbiBinProvider: AbiBinProvider,
  DeployAndSetOpsAndAdminHelper: DeployAndSetOpsAndAdminHelper,
  PriceOracleHelper: PriceOracleHelper
};
