'use strict';
/**
 * Test constants.
 *
 * @module test/scripts/constants
 */

const testConstants = {
  auxRpcProvider: process.env.OST_AUX_GETH_RPC_PROVIDER,
  auxWsProvider: process.env.OST_AUX_GETH_WS_PROVIDER,
  auxOwnerAddress: process.env.OST_AUX_OWNER_ADDR,
  auxOwnerPassPhrase: process.env.OST_AUX_OWNER_PASSPHRASE,
  auxAdminAddress: process.env.OST_AUX_ADMIN_ADDR,
  auxAdminPassPhrase: process.env.OST_AUX_ADMIN_PASSPHRASE,
  auxOpsAddress: process.env.OST_AUX_OPS_ADDR,
  auxOpsPassPhrase: process.env.OST_AUX_OPS_PASSPHRASE,
  auxPrice: process.env.OST_AUX_SET_PRICE,
  auxChainId: process.env.OST_AUX_CHAIN_ID
};

testConstants.baseCurrency = 'OST';
testConstants.usdQuoteCurrency = 'USD';
testConstants.euroQuoteCurrency = 'EUR';

module.exports = testConstants;
