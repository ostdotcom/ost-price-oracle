'use strict';
/**
 * Index for ost-price-oracle
 *
 * @module index
 */
const rootPrefix = '.',
  AbiBinProvider = require(rootPrefix + '/lib/AbiBinProvider'),
  PriceOracleHelper = require(rootPrefix + '/lib/helpers/setup/PriceOracle'),
  DeployAndSetInOpsHelper = require(rootPrefix + '/lib/helpers/setup/DeployAndSetInOps');

module.exports = {
  AbiBinProvider: AbiBinProvider,
  DeployAndSetInOpsHelper: DeployAndSetInOpsHelper,
  PriceOracleHelper: PriceOracleHelper
};
