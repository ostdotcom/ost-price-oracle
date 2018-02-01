"use strict";

/**
 *
 * This is a utility file which would be used for executing all methods on Price Oracle Contract.<br><br>
 *
 * @module lib/contract_interact/price_oracle
 *
 */
const rootPrefix = '../..'
  , contractName = 'priceOracle'
  , opsName = 'ops'
  , web3RpcProvider = require(rootPrefix+'/lib/web3/providers/rpc')
  , helper = require('./helper')
  , coreConstants = require(rootPrefix + '/config/core_constants')
  , coreAddresses = require(rootPrefix + '/config/core_addresses')
  , contractAbi = coreAddresses.getAbiForContract(contractName)
  , currContract = new web3RpcProvider.eth.Contract(contractAbi)
  , gasLimit = coreConstants.OST_PO_GAS_LIMIT
  , logger = require(rootPrefix + '/helpers/custom_console_logger')
  , BigNumber = require('bignumber.js')
  ;

/**
 * @constructor
 *
 */
const PriceOracle = function () {
};

/**
 * Get Price from contract
 *
 * @param {String} baseCurrency - base Currency
 * @param {String} quoteCurrency - quote Currency
 *
 * @return {Promise}
 *
 */
PriceOracle.prototype.getPrice = function(baseCurrency, quoteCurrency){
  const contractAddr = coreAddresses.getAddressOfPriceOracleContract(baseCurrency, quoteCurrency);
  currContract.options.address = contractAddr;
  currContract.setProvider( web3RpcProvider.currentProvider );
  const transactionObject = currContract.methods.getPrice();
  const encodedABI = transactionObject.encodeABI();
  const transactionOutputs = helper.getTransactionOutputs( transactionObject );
  return helper.call(web3RpcProvider, contractAddr, encodedABI, {}, transactionOutputs)
    .then( function(response){
      const price = parseInt(response[0]);
      return Promise.resolve(price);
  });
},

/**
 * Get Price in decimals
 *
 * @param {String} baseCurrency - base Currency
 * @param {String} quoteCurrency - quote Currency
 *
 * @return {Promise}
 *
 */
PriceOracle.prototype.decimalPrice = function(baseCurrency, quoteCurrency){
  return this.getPrice(baseCurrency, quoteCurrency)
    .then(function(price){
      const decimalVal = (price/helper.decimalPrecisionInWei());
      return Promise.resolve(decimalVal);
  });
},

/**
 * Get Fixed Point integer for a decimal value in precision of wei
 *
 * @param {Decimal} decimalPrice - decimal price e.g. 1.2
 *
 * @return {BigNumber}
 *
 */
PriceOracle.prototype.fixedPointIntegerPrice = function(decimalPrice){
  return new BigNumber(web3RpcProvider.utils.toWei(decimalPrice.toString(), "ether"));
},

/**
 * Set Price in contract
 *
 * @param {String} baseCurrency - base Currency
 * @param {String} quoteCurrency - quote Currency
 * @param {BigNumber} price - Price in fixed point integer
 * @param {Hex} gasPrice - gasPrice in hex value e.g. 0x12A05F200
 *
 * @return {Promise}
 *
 */
PriceOracle.prototype.setPrice = function(baseCurrency, quoteCurrency, price, gasPrice){
    const priceVal = new BigNumber(price);
    helper.validatePrice(priceVal);
    const contractAddr = coreAddresses.getAddressOfPriceOracleContract(baseCurrency, quoteCurrency);
    currContract.options.address = contractAddr;
    currContract.setProvider( web3RpcProvider.currentProvider );

    const encodedABI = currContract.methods.setPrice(priceVal).encodeABI();
    return helper.safeSend( web3RpcProvider, contractAddr, encodedABI, opsName, { gasPrice: gasPrice, gas: gasLimit })
      .then( function(transactionReceipt){
        logger.info('----------------------------------------------------------------------');
        logger.info(JSON.stringify(transactionReceipt));
        logger.info('----------------------------------------------------------------------');

        return Promise.resolve(transactionReceipt);
    });
},

/**
 * Get token decimals precision
 *
 * @param {String} baseCurrency - base Currency
 * @param {String} quoteCurrency - quote Currency
 *
 * @return {Promise}
 *
 */
PriceOracle.prototype.decimals = function(baseCurrency, quoteCurrency){
  const contractAddr = coreAddresses.getAddressOfPriceOracleContract(baseCurrency, quoteCurrency);
  currContract.options.address = contractAddr;
  currContract.setProvider( web3RpcProvider.currentProvider );
  const transactionObject = currContract.methods.decimals();
  const encodedABI = transactionObject.encodeABI();
  const transactionOutputs = helper.getTransactionOutputs( transactionObject );
  return helper.call(web3RpcProvider, contractAddr, encodedABI, {}, transactionOutputs)
    .then(function(response){
      return Promise.resolve(parseInt(response[0]));
  });
},

/**
 * Get Price expiration height block number
 *
 * @param {String} baseCurrency - base Currency
 * @param {String} quoteCurrency - quote Currency
 *
 * @return {Promise}
 *
 */
PriceOracle.prototype.getExpirationHeight = function(baseCurrency, quoteCurrency){
  const contractAddr = coreAddresses.getAddressOfPriceOracleContract(baseCurrency, quoteCurrency);
  currContract.options.address = contractAddr;
  currContract.setProvider( web3RpcProvider.currentProvider );
  const transactionObject = currContract.methods.expirationHeight();
  const encodedABI = transactionObject.encodeABI();
  const transactionOutputs = helper.getTransactionOutputs( transactionObject );
  return helper.call(web3RpcProvider, contractAddr, encodedABI, {}, transactionOutputs)
    .then( function(response){
    return Promise.resolve(parseInt(response[0]));
  });
},

/**
 * get base currency ISO code i.e. OST/ETH
 *
 * @param {String} contractAddress - deployed contract address
 *
 * @return {Promise}
 *
 */
PriceOracle.prototype.getBaseCurrency = function(contractAddress){
  currContract.options.address = contractAddress;
  currContract.setProvider( web3RpcProvider.currentProvider );
  const transactionObject = currContract.methods.baseCurrency();
  const encodedABI = transactionObject.encodeABI();
  const transactionOutputs = helper.getTransactionOutputs( transactionObject );
  return helper.call(web3RpcProvider, contractAddress, encodedABI, {}, transactionOutputs).
    then( function(response){
      return Promise.resolve(web3RpcProvider.utils.hexToAscii(response[0]));
  });

},

/**
 * Get Quote Currency ISO code USD/EUR
 *
 * @param {String} contractAddress - deployed contract address
 *
 * @return {Promise}
 *
 */
PriceOracle.prototype.getQuoteCurrency = function(contractAddress){
  currContract.options.address = contractAddress;
  currContract.setProvider( web3RpcProvider.currentProvider );
  const transactionObject = currContract.methods.quoteCurrency();
  const encodedABI = transactionObject.encodeABI();
  const transactionOutputs = helper.getTransactionOutputs( transactionObject );
  return helper.call(web3RpcProvider, contractAddress, encodedABI, {}, ['bytes3']).
    then( function(response){
      return Promise.resolve(web3RpcProvider.utils.hexToAscii(response[0]));
  });
}

module.exports = new PriceOracle();

