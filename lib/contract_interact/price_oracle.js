"use strict";

/**
 *
 * This is a utility file which would be used for executing all methods on Price Oracle Contract.<br><br>
 *
 * @module lib/contract_interact/price_oracle
 *
 */
// TODO Commenting Update
// TODO getQuoteCurrency, getBaseCurrency response
const rootPrefix = '../..'
  , contractName = 'priceOracle'
  , senderName = 'deployer'
  , web3RpcProvider = require(rootPrefix+'/lib/web3/providers/rpc')
  , helper = require('./helper')
  , coreConstants = require(rootPrefix + '/config/core_constants')
  , coreAddresses = require(rootPrefix + '/config/core_addresses')
  , contractAbi = coreAddresses.getAbiForContract(contractName)
  , currContract = new web3RpcProvider.eth.Contract(contractAbi)
  , GAS_PRICE = coreConstants.OST_GAS_PRICE
  , GAS_LIMIT = coreConstants.OST_GAS_LIMIT
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
  helper.call(web3RpcProvider, contractAddr, encodedABI, {}, transactionOutputs).
    then( function(response){
      return Promise.resolve(response[0]);
  });
},

/**
 * Get Price in decimals
 *
 * @return {Promise}
 *
 */
PriceOracle.prototype.decimalPrice = function(baseCurrency, quoteCurrency){
  const price = new BigNumber(this.getPrice(baseCurrency, quoteCurrency));
  return price/helper.decimalPrecisionInWei();
},

/**
 * Get Fixed Point integer for a decimal value in precision of wei
 *
 * @param {Decimal} decimalPrice - decimal price
 *
 * @return {BigNumber}
 *
 */
PriceOracle.prototype.fixedPointIntegerPrice = function(decimalPrice){
  return new BigNumber(web3RpcProvider.utils.toWei(decimalPrice, "ether"));
},

/**
 * Set Price in contract
 *
 * @param {BigNumber} price - Price in fixed point integer
 *
 * @return {Promise}
 *
 */
PriceOracle.prototype.setPrice = function(baseCurrency, quoteCurrency, price){
    const priceVal = new BigNumber(price);
    helper.validatePrice(priceVal);
    const contractAddr = coreAddresses.getAddressOfPriceOracleContract(baseCurrency, quoteCurrency);
    currContract.options.address = contractAddr;
    currContract.setProvider( web3RpcProvider.currentProvider );

    const encodedABI = currContract.methods.setPrice(priceVal).encodeABI();
    helper.safeSend( web3RpcProvider, contractAddr, encodedABI, senderName, { gasPrice: GAS_PRICE, gas: GAS_LIMIT }).
      then( function(transactionReceipt){
        logger.info('----------------------------------------------------------------------');
        logger.info(JSON.stringify(transactionReceipt));
        logger.info('----------------------------------------------------------------------');

        return Promise.resolve(transactionReceipt);
    });
},

/**
 * Get token decimals precision
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
  helper.call(web3RpcProvider, contractAddr, encodedABI, {}, transactionOutputs).
    then(function(response){
      return Promise.resolve(response[0]);
  });
},

/**
 * Get Price expiration height block number
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
  helper.call(web3RpcProvider, contractAddr, encodedABI, {}, transactionOutputs).
    then( function(response){
    return Promise.resolve(response[0]);
  });
},

/**
 * get base currency ISO code i.e. OST/ETH
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
  helper.call(web3RpcProvider, contractAddress, encodedABI, {}, transactionOutputs).
    then( function(response){
      return Promise.resolve(web3RpcProvider.utils.hexToAscii(response[0]));
  });

},

/**
 * Get Quote Currency ISO code USD/EUR
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
  helper.call(web3RpcProvider, contractAddress, encodedABI, {}, transactionOutputs).
    then( function(response){
      return Promise.resolve(web3RpcProvider.utils.hexToAscii(response[0]));
  });
}

module.exports = new PriceOracle();

