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
  auxOwnerPrivateKey: process.env.OST_AUX_OWNER_PVT_KEY,

  auxAdminAddress: process.env.OST_AUX_ADMIN_ADDR,
  auxAdminPrivateKey: process.env.OST_AUX_ADMIN_PVT_KEY,

  auxOpsAddress: process.env.OST_AUX_OPS_ADDR,
  auxOpsPrivateKey: process.env.OST_AUX_OPS_PVT_KEY,

  auxChainId: process.env.OST_AUX_CHAIN_ID,

  baseCurrency: 'OST',
  usdQuoteCurrency: 'USD',
  euroQuoteCurrency: 'EUR',

  tempFilePath: './temp.txt'
};

module.exports = testConstants;
