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

const openSTCache = require('@openstfoundation/openst-cache')
  , cacheImplementer = openSTCache.cache
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
 * @param {Integer} chainId - running geth chain ID
 * @param {String} baseCurrency - base Currency
 * @param {String} quoteCurrency - quote Currency
 *
 * @return {Promise}
 *
 */
PriceOracle.prototype.getPrice = function(chainId, baseCurrency, quoteCurrency) {
  const oThis = this;
  return new Promise(function (onResolve, onReject) {

    var response = helper.validateCurrency(baseCurrency, quoteCurrency);
    if (!response.success) {
      return onResolve(response);
    }

    const contractAddress = coreAddresses.getAddressOfPriceOracleContract(baseCurrency, quoteCurrency);
    var result = oThis.setContractInstance(contractAddress);
    const transactionObject = result.data.currentContract.methods.getPrice();
    const encodedABI = transactionObject.encodeABI();
    const transactionOutputs = helper.getTransactionOutputs(transactionObject);
    cacheImplementer.get(helper.oraclePricePointKey(chainId, contractAddress))
      .then(function (cacheResponse) {
        var cachedPrice = cacheResponse.data.response;
        if (cacheResponse.isSuccess() && cachedPrice != undefined && cachedPrice != 'null') {
          return onResolve(responseHelper.successWithData({price: cachedPrice}));
        } else {
          helper.call(web3RpcProvider, contractAddress, encodedABI, {}, transactionOutputs)
            .then(function (response) {
              const price = parseInt(response[0]);
              cacheImplementer.set(helper.oraclePricePointKey(chainId, contractAddress), price);
              return onResolve(responseHelper.successWithData({price: price}));
            });
        }
      });
  });
}


/**
 * Get Price in decimals
 *
 * @param {Integer} chainId - running geth chain ID
 * @param {String} baseCurrency - base Currency
 * @param {String} quoteCurrency - quote Currency
 *
 * @return {Promise}
 *
 */
PriceOracle.prototype.decimalPrice = function(chainId, baseCurrency, quoteCurrency){
  const oThis = this;
  return new Promise(function (onResolve, onReject) {

    var response = helper.validateCurrency(baseCurrency, quoteCurrency);
    if (!response.success) {
      return onResolve(response);
    }

    oThis.getPrice(chainId, baseCurrency, quoteCurrency)
      .then(function(response){
        const decimalVal = (response.data.price/helper.decimalPrecisionInWei());
        return onResolve(responseHelper.successWithData({price: decimalVal}));
      });

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
 * * @param {Hex} price - gasPrice
 *
 * @return {Object}
 *
 */
PriceOracle.prototype.setPriceData = function(baseCurrency, quoteCurrency, price, gasPrice){
  var response = helper.validateCurrency(baseCurrency, quoteCurrency);
  if (!response.success){
    return response;
  }

  const priceVal = new BigNumber(price);
  if (priceVal.equals(0)) {
    return responseHelper.error('l_ci_po_spd_3', 'Zero Price is not allowed');
  }
  if (priceVal.isInt() === false) {
    return responseHelper.error('l_ci_po_spd_4', 'Price should be fixed point integer not floating point number');
  }

  if (priceVal.equals(0)) {
    return responseHelper.error('l_ci_po_spd_5', 'Zero Price is not allowed');
  }

  if (gasPrice === undefined || gasPrice === '') {
    return responseHelper.error('l_ci_po_spd_6', 'gasPrice is mandatory');
  }

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
 * @param {Integer} chainId - Chain ID
 * @param {String} baseCurrency - base Currency
 * @param {String} quoteCurrency - quote Currency
 * @param {BigNumber} price - Price in fixed point integer
 * @param {Hex} gasPrice - gasPrice in hex value e.g. 0x12A05F200
 *
 * @return {Promise}
 *
 */
PriceOracle.prototype.setPrice = function(chainId, baseCurrency, quoteCurrency, price, gasPrice){
  const oThis= this;
  return new Promise(function(onResolve, onReject) {

    var response = oThis.setPriceData(baseCurrency, quoteCurrency, price, gasPrice);
    if (!response.success){
      return onResolve(response);
    }

    helper.sendTxAsync(web3RpcProvider, response.data.contractAddress, response.data.encodedABI, opsName, { gasPrice: gasPrice, gas: gasLimit })
      .then(function(transactionHash){
        cacheImplementer.del(helper.oraclePricePointKey(chainId, response.data.contractAddress));
        onResolve(responseHelper.successWithData({transactionHash: transactionHash}));
        //cacheImplementer.del(helper.oraclePricePointKey(chainId, response.data.contractAddress));
        //cacheImplementer.del(helper.oracleExpirationHeightKey(chainId, response.data.contractAddress));
      });

  });
},

/**
 * Set Price in contract and wait for mining
 *
 * @param {Integer} chainId - Chain ID
 * @param {String} baseCurrency - base Currency
 * @param {String} quoteCurrency - quote Currency
 * @param {BigNumber} price - Price in fixed point integer
 * @param {Hex} gasPrice - gasPrice in hex value e.g. 0x12A05F200
 *
 * @return {Promise}
 *
 */
PriceOracle.prototype.setPriceInSync = function(chainId, baseCurrency, quoteCurrency, price, gasPrice){
  const oThis = this;
  var response = oThis.setPriceData(baseCurrency, quoteCurrency, price, gasPrice);
  if (!response.success){
    return response;
  }
  return helper.safeSend( web3RpcProvider, response.data.contractAddress, response.data.encodedABI, opsName, { gasPrice: gasPrice, gas: gasLimit })
    .then( function(transactionReceipt){
      logger.info('----------------------------------------------------------------------');
      logger.info(JSON.stringify(transactionReceipt));
      logger.info('----------------------------------------------------------------------');
      cacheImplementer.del(helper.oraclePricePointKey(chainId, response.data.contractAddress))
        .then( function(){
          return Promise.resolve(responseHelper.successWithData({transactionReceipt: transactionReceipt}));
        });
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
  const oThis= this;
  return new Promise(function(onResolve, onReject) {

    var response = helper.validateCurrency(baseCurrency, quoteCurrency);
    if (!response.success){
      return onResolve(response);
    }

    const contractAddress = coreAddresses.getAddressOfPriceOracleContract(baseCurrency, quoteCurrency);
    var result = oThis.setContractInstance(contractAddress);
    const transactionObject = result.data.currentContract.methods.decimals();
    const encodedABI = transactionObject.encodeABI();
    const transactionOutputs = helper.getTransactionOutputs( transactionObject );
    helper.call(web3RpcProvider, contractAddress, encodedABI, {}, transactionOutputs)
      .then(function(response){
        var decimals = parseInt(response[0]);
        return onResolve(responseHelper.successWithData({decimals: decimals}));
      });

  });
},

/**
 * Get Price expiration height block number
 *
 * @param {Integer} chainId - Chain ID
 * @param {String} baseCurrency - base Currency
 * @param {String} quoteCurrency - quote Currency
 *
 * @return {Promise}
 *
 */
PriceOracle.prototype.getExpirationHeight = function(chainId, baseCurrency, quoteCurrency){
  const oThis= this;
  return new Promise(function(onResolve, onReject) {
    var response = helper.validateCurrency(baseCurrency, quoteCurrency);
    if (!response.success){
      return onResolve(response);
    }

    const contractAddress = coreAddresses.getAddressOfPriceOracleContract(baseCurrency, quoteCurrency);
    var result = oThis.setContractInstance(contractAddress);
    const transactionObject = result.data.currentContract.methods.expirationHeight();
    const encodedABI = transactionObject.encodeABI();
    const transactionOutputs = helper.getTransactionOutputs( transactionObject );
    cacheImplementer.get(helper.oracleExpirationHeightKey(chainId, contractAddress))
      .then( function(cacheResponse){
        var expirationHeight = cacheResponse.data.response;
        if (cacheResponse.isSuccess() && expirationHeight != undefined && expirationHeight != 'null') {
          return onResolve(responseHelper.successWithData({expirationHeight: parseInt(expirationHeight)}));
        } else {
          helper.call(web3RpcProvider, contractAddress, encodedABI, {}, transactionOutputs)
            .then(function(response){
              var expirationHeight = parseInt(response[0]);
              cacheImplementer.set(helper.oracleExpirationHeightKey(chainId, contractAddress), expirationHeight);
              return onResolve(responseHelper.successWithData({expirationHeight: expirationHeight}));
            });
        }
      });
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
  const oThis= this;
  return new Promise(function(onResolve, onReject) {

    var response = helper.validateContractAddress(contractAddress);
    if (!response.success){
      return onResolve(response);
    }

    var result = oThis.setContractInstance(contractAddress);
    const transactionObject = result.data.currentContract.methods.baseCurrency();
    const encodedABI = transactionObject.encodeABI();
    const transactionOutputs = helper.getTransactionOutputs( transactionObject );
    helper.call(web3RpcProvider, contractAddress, encodedABI, {}, transactionOutputs)
      .then(function(response){
        var baseCurrency = web3RpcProvider.utils.hexToAscii(response[0]);
        return onResolve(responseHelper.successWithData({baseCurrency: baseCurrency}));
      });

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
  const oThis= this;
  return new Promise(function(onResolve, onReject) {
    var response = helper.validateContractAddress(contractAddress);
    if (!response.success){
      return onResolve(response);
    }
    var result = oThis.setContractInstance(contractAddress);
    const transactionObject = result.data.currentContract.methods.quoteCurrency();
    const encodedABI = transactionObject.encodeABI();
    const transactionOutputs = helper.getTransactionOutputs( transactionObject );
    helper.call(web3RpcProvider, contractAddress, encodedABI, {}, transactionOutputs)
      .then(function(response){
        var quoteCurrency = web3RpcProvider.utils.hexToAscii(response[0]);
        return onResolve(responseHelper.successWithData({quoteCurrency: quoteCurrency}));
      });

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
},



module.exports = new PriceOracle();

