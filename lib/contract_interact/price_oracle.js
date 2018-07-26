"use strict";

/**
 *
 * This is a utility file which would be used for executing all methods on Price Oracle Contract.<br><br>
 *
 * @module lib/contract_interact/price_oracle
 *
 */
const rootPrefix      = '../..'
  , InstanceComposer  = require( rootPrefix + "/instance_composer")
  , logger            = require(rootPrefix + '/helpers/custom_console_logger')
  , BigNumber         = require('bignumber.js')
  , responseHelper    = require(rootPrefix + '/lib/formatter/response')
  , paramErrorConfig  = require(rootPrefix + '/config/param_error_config')
  , apiErrorConfig    = require(rootPrefix + '/config/api_error_config')
;

require(rootPrefix + '/lib/contract_interact/helper');
require(rootPrefix + '/config/core_constants');
require(rootPrefix + '/config/core_addresses');
require(rootPrefix +'/lib/web3/providers/ws');
require(rootPrefix + '/lib/providers/cache');

const errorConfig = {
  param_error_config: paramErrorConfig,
  api_error_config: apiErrorConfig
};

const contractName  = 'priceOracle'
    , opsName       = 'ops'
;

/**
 * @constructor
 *
 */
const PriceOracle = function ( configStrategy, instanceComposer ) {

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
  const oThis = this ,
        coreConstants     = oThis.ic().getCoreConstants(),
        coreAddresses     = oThis.ic().getCoreAddresses() ,
        helper            = oThis.ic().getContractInteractHelper(),
        web3Provider      = oThis.ic().getWeb3WSProvider(),
        cacheProvider     = oThis.ic().getCacheProvider(),
        cacheObj          = cacheProvider.getInstance(),
        cacheImplementer  = cacheObj.cacheInstance
  ;
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
          helper.call(web3Provider, contractAddress, encodedABI, {}, transactionOutputs)
            .then(function (response) {
              const price = parseInt(response[0]);
              cacheImplementer.set(helper.oraclePricePointKey(chainId, contractAddress), price);
              return onResolve(responseHelper.successWithData({price: price}));
            });
        }
      });
  });
};


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
  const oThis   = this
      , helper  = oThis.ic().getContractInteractHelper()
  ;
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
  const oThis = this,
        web3Provider = oThis.ic().getWeb3WSProvider()
    ;
  var fixedPointIntegerPrice = new BigNumber(web3Provider.utils.toWei(decimalPrice.toString(), "ether"));
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

  const oThis = this
      , coreAddresses  = oThis.ic().getCoreAddresses()
      , helper         = oThis.ic().getContractInteractHelper()
  ;

  var response = helper.validateCurrency(baseCurrency, quoteCurrency);
  if (!response.success){
    return response;
  }

  const priceVal = new BigNumber(price);
  if (priceVal.equals(0)) {
    let errorParams = {
      internal_error_identifier: 'l_ci_po_spd_3',
      api_error_identifier: 'zero_price_invalid',
      error_config: errorConfig,
      debug_options: {}
    };
    return responseHelper.error(errorParams);
  }
  if (priceVal.isInt() === false) {
    let errorParams = {
      internal_error_identifier: 'l_ci_po_spd_4',
      api_error_identifier: 'price_invalid',
      error_config: errorConfig,
      debug_options: {}
    };
    return responseHelper.error(errorParams);
  }

  if (priceVal.equals(0)) {
    let errorParams = {
      internal_error_identifier: 'l_ci_po_spd_5',
      api_error_identifier: 'zero_price_invalid',
      error_config: errorConfig,
      debug_options: {}
    };
    return responseHelper.error(errorParams);
  }

  if (gasPrice === undefined || gasPrice === '') {
    let errorParams = {
      internal_error_identifier: 'l_ci_po_spd_6',
      api_error_identifier: 'gas_price_invalid',
      error_config: errorConfig,
      debug_options: {}
    };
    return responseHelper.error(errorParams);
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
  const oThis = this
      , coreConstants     = oThis.ic().getCoreConstants()
      , helper            = oThis.ic().getContractInteractHelper()
      , web3Provider      = oThis.ic().getWeb3WSProvider()
      , cacheProvider     = oThis.ic().getCacheProvider()
      , cacheObj          = cacheProvider.getInstance()
      , cacheImplementer  = cacheObj.cacheInstance
      , gasLimit          = coreConstants.OST_UTILITY_GAS_LIMIT
  ;
  return new Promise(function(onResolve, onReject) {

    var response = oThis.setPriceData(baseCurrency, quoteCurrency, price, gasPrice);
    if (!response.success){
      return onResolve(response);
    }

    helper.sendTxAsync(web3Provider, response.data.contractAddress, response.data.encodedABI, opsName, { gasPrice: gasPrice, gas: gasLimit })
      .then(function(transactionHash){
        cacheImplementer.del(helper.oraclePricePointKey(chainId, response.data.contractAddress));
        onResolve(responseHelper.successWithData({transactionHash: transactionHash}));
        // Flush Cache
        helper.getTxReceipt(web3Provider, transactionHash)
          .then(function(receipt){
            helper.flushSetPriceCache(chainId, response.data.contractAddress);
          })
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
  const oThis = this
      , coreConstants   = oThis.ic().getCoreConstants()
      , helper          = oThis.ic().getContractInteractHelper()
      , web3Provider    = oThis.ic().getWeb3WSProvider()
      , gasLimit        = coreConstants.OST_UTILITY_GAS_LIMIT
  ;
  var response = oThis.setPriceData(baseCurrency, quoteCurrency, price, gasPrice);
  if (!response.success){
    return response;
  }
  return helper.safeSend( web3Provider, response.data.contractAddress, response.data.encodedABI, opsName, { gasPrice: gasPrice, gas: gasLimit })
    .then( function(transactionReceipt){
      logger.debug('----------------------------------------------------------------------');
      logger.debug(JSON.stringify(transactionReceipt));
      logger.debug('----------------------------------------------------------------------');
      helper.flushSetPriceCache(chainId, response.data.contractAddress)
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
  const oThis = this
    , coreAddresses   = oThis.ic().getCoreAddresses()
    , helper          = oThis.ic().getContractInteractHelper()
    , web3Provider    = oThis.ic().getWeb3WSProvider()
  ;
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
    helper.call(web3Provider, contractAddress, encodedABI, {}, transactionOutputs)
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
  const oThis = this
      , helper            = oThis.ic().getContractInteractHelper()
      , coreAddresses     = oThis.ic().getCoreAddresses()
      , web3Provider      = oThis.ic().getWeb3WSProvider()
      , cacheProvider     = oThis.ic().getCacheProvider()
      , cacheObj          = cacheProvider.getInstance()
      , cacheImplementer  = cacheObj.cacheInstance
  ;
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
          helper.call(web3Provider, contractAddress, encodedABI, {}, transactionOutputs)
            .then(function(response){
              var expirationHeight = parseInt(response[0]);
              cacheImplementer.set(helper.oracleExpirationHeightKey(chainId, contractAddress), expirationHeight);
              return onResolve(responseHelper.successWithData({expirationHeight: expirationHeight}));
            });
        }
      });
  });
};

/**
 * get base currency ISO code i.e. OST/ETH
 *
 * @param {String} contractAddress - deployed contract address
 *
 * @return {Promise}
 *
 */
PriceOracle.prototype.getBaseCurrency = function(contractAddress){
  const oThis = this
      , helper        = oThis.ic().getContractInteractHelper()
      , web3Provider  = oThis.ic().getWeb3WSProvider()
  ;
  return new Promise(function(onResolve, onReject) {

    var response = helper.validateContractAddress(contractAddress);
    if (!response.success){
      return onResolve(response);
    }

    var result = oThis.setContractInstance(contractAddress);
    const transactionObject = result.data.currentContract.methods.baseCurrency();
    const encodedABI = transactionObject.encodeABI();
    const transactionOutputs = helper.getTransactionOutputs( transactionObject );
    helper.call(web3Provider, contractAddress, encodedABI, {}, transactionOutputs)
      .then(function(response){
        var baseCurrency = web3Provider.utils.hexToAscii(response[0]);
        return onResolve(responseHelper.successWithData({baseCurrency: baseCurrency}));
      });

  });
};

/**
 * Get Quote Currency ISO code USD/EUR
 *
 * @param {String} contractAddress - deployed contract address
 *
 * @return {Promise}
 *
 */
PriceOracle.prototype.getQuoteCurrency = function(contractAddress){
  const oThis  = this
      , helper        = oThis.ic().getContractInteractHelper()
      , web3Provider  = oThis.ic().getWeb3WSProvider()
  ;
  return new Promise(function(onResolve, onReject) {
    var response = helper.validateContractAddress(contractAddress);
    if (!response.success){
      return onResolve(response);
    }
    var result = oThis.setContractInstance(contractAddress);
    const transactionObject = result.data.currentContract.methods.quoteCurrency();
    const encodedABI = transactionObject.encodeABI();
    const transactionOutputs = helper.getTransactionOutputs( transactionObject );
    helper.call(web3Provider, contractAddress, encodedABI, {}, transactionOutputs)
      .then(function(response){
        var quoteCurrency = web3Provider.utils.hexToAscii(response[0]);
        return onResolve(responseHelper.successWithData({quoteCurrency: quoteCurrency}));
      });

  });
};

/**
 * Set Contract Instance
 *
 * @param {String} contractAddress - deployed contract address
 *
 * @return {Object}
 *
 */
PriceOracle.prototype.setContractInstance = function(contractAddress){
  const   oThis = this ,
          web3Provider    = oThis.ic().getWeb3WSProvider(),
          coreAddresses   = oThis.ic().getCoreAddresses(),
          contractAbi     = coreAddresses.getAbiForContract(contractName),
          currContract    = new web3Provider.eth.Contract(contractAbi)
  ;

  currContract.options.address = contractAddress;
  //currContract.setProvider( web3Provider.currentProvider );
  return responseHelper.successWithData({currentContract: currContract});
};

InstanceComposer.register(PriceOracle, "getPriceOracle", true);

module.exports =  PriceOracle;

