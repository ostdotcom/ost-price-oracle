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
  , responseHelper = require(rootPrefix + '/lib/formatter/response')
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
  const contractAddress = coreAddresses.getAddressOfPriceOracleContract(baseCurrency, quoteCurrency);
  var result = this.setContractInstance(contractAddress);
  const transactionObject = result.data.currentContract.methods.getPrice();
  const encodedABI = transactionObject.encodeABI();
  const transactionOutputs = helper.getTransactionOutputs( transactionObject );
  return helper.call(web3RpcProvider, contractAddress, encodedABI, {}, transactionOutputs)
    .then( function(response){
      const price = parseInt(response[0]);
      return Promise.resolve(responseHelper.successWithData({price: price}));
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
    .then(function(response){
      const decimalVal = (response.data.price/helper.decimalPrecisionInWei());
      return Promise.resolve(responseHelper.successWithData({price: decimalVal}));
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
  var fixedPointIntegerPrice = new BigNumber(web3RpcProvider.utils.toWei(decimalPrice.toString(), "ether"));
  return responseHelper.successWithData({price: fixedPointIntegerPrice});
},

/**
 * Set Price Data
 *
 * @param {String} baseCurrency - base Currency
 * @param {String} quoteCurrency - quote Currency
 * @param {BigNumber} price - Price in fixed point integer
 *
 * @return {Object}
 *
 */
PriceOracle.prototype.setPriceData = function(baseCurrency, quoteCurrency, price){
  const priceVal = new BigNumber(price);
  helper.validatePrice(priceVal);
  const contractAddress = coreAddresses.getAddressOfPriceOracleContract(baseCurrency, quoteCurrency);
  var result = this.setContractInstance(contractAddress);
  const encodedABI = result.data.currentContract.methods.setPrice(priceVal).encodeABI();
  var response = {
    contractAddress: contractAddress,
    encodedABI: encodedABI
  };
  return responseHelper.successWithData(response);
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
    var response = this.setPriceData(baseCurrency, quoteCurrency, price);
    return helper.sendTxAsync(web3RpcProvider, response.data.contractAddress, response.data.encodedABI, opsName, { gasPrice: gasPrice, gas: gasLimit })
      .then(function(transactionHash){
        return Promise.resolve(responseHelper.successWithData({transactionHash: transactionHash}));
    });
},

/**
 * Set Price in contract and wait for mining
 *
 * @param {String} baseCurrency - base Currency
 * @param {String} quoteCurrency - quote Currency
 * @param {BigNumber} price - Price in fixed point integer
 * @param {Hex} gasPrice - gasPrice in hex value e.g. 0x12A05F200
 *
 * @return {Promise}
 *
 */
PriceOracle.prototype.setPriceInSync = function(baseCurrency, quoteCurrency, price, gasPrice){
  var response = this.setPriceData(baseCurrency, quoteCurrency, price);
  return helper.safeSend( web3RpcProvider, response.data.contractAddress, response.data.encodedABI, opsName, { gasPrice: gasPrice, gas: gasLimit })
    .then( function(transactionReceipt){
      logger.info('----------------------------------------------------------------------');
      logger.info(JSON.stringify(transactionReceipt));
      logger.info('----------------------------------------------------------------------');
      return Promise.resolve(responseHelper.successWithData({transactionReceipt: transactionReceipt}));
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
  const contractAddress = coreAddresses.getAddressOfPriceOracleContract(baseCurrency, quoteCurrency);
  var result = this.setContractInstance(contractAddress);
  const transactionObject = result.data.currentContract.methods.decimals();
  const encodedABI = transactionObject.encodeABI();
  const transactionOutputs = helper.getTransactionOutputs( transactionObject );
  return helper.call(web3RpcProvider, contractAddress, encodedABI, {}, transactionOutputs)
    .then(function(response){
      var decimals = parseInt(response[0]);
      return Promise.resolve(responseHelper.successWithData({decimals: decimals}));
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
  const contractAddress = coreAddresses.getAddressOfPriceOracleContract(baseCurrency, quoteCurrency);
  var result = this.setContractInstance(contractAddress);
  const transactionObject = result.data.currentContract.methods.expirationHeight();
  const encodedABI = transactionObject.encodeABI();
  const transactionOutputs = helper.getTransactionOutputs( transactionObject );
  return helper.call(web3RpcProvider, contractAddress, encodedABI, {}, transactionOutputs)
    .then( function(response){
    var expirationHeight = parseInt(response[0]);
    return Promise.resolve(responseHelper.successWithData({expirationHeight: expirationHeight}));
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
  var result = this.setContractInstance(contractAddress);
  const transactionObject = result.data.currentContract.methods.baseCurrency();
  const encodedABI = transactionObject.encodeABI();
  const transactionOutputs = helper.getTransactionOutputs( transactionObject );
  return helper.call(web3RpcProvider, contractAddress, encodedABI, {}, transactionOutputs).
    then( function(response){
    var baseCurrency = web3RpcProvider.utils.hexToAscii(response[0]);
    return Promise.resolve(responseHelper.successWithData({baseCurrency: baseCurrency}));
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
  var result = this.setContractInstance(contractAddress);
  const transactionObject = result.data.currentContract.methods.quoteCurrency();
  const encodedABI = transactionObject.encodeABI();
  const transactionOutputs = helper.getTransactionOutputs( transactionObject );
  return helper.call(web3RpcProvider, contractAddress, encodedABI, {}, transactionOutputs).
    then( function(response){
    var quoteCurrency = web3RpcProvider.utils.hexToAscii(response[0]);
    return Promise.resolve(responseHelper.successWithData({quoteCurrency: quoteCurrency}));
  });
},

/**
 * Set Contract Instance
 *
 * @param {String} contractAddress - deployed contract address
 *
 * @return {Object}
 *
 */
PriceOracle.prototype.setContractInstance = function(contractAddress){
  currContract.options.address = contractAddress;
  currContract.setProvider( web3RpcProvider.currentProvider );
  return responseHelper.successWithData({currentContract: currContract});
}


module.exports = new PriceOracle();

