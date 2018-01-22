"use strict";

/**
 *
 * This is a utility file which would be used for executing all methods on Price Oracle Contract.<br><br>
 *
 * @module lib/contract_interact/price_oracle
 *
 */

// TODO Comments
const rootPrefix = '../..'
  , contractName = 'priceOracle'
  , senderName = 'deployer'
  , web3RpcProvider = require(rootPrefix+'/lib/web3/providers/rpc')
  , helper = require(rootPrefix+'/helper')
  , coreConstants = require(rootPrefix + '/config/core_constants')
  , coreAddresses = require(rootPrefix + '/config/core_addresses')
  , contractAbi = coreAddresses.getAbiForContract(contractName)
  , contractAddr = coreAddresses.getAddressForContract(contractName)
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
const PriceOracle = module.exports = function () {
  currContract.options.address = contractAddr;
  currContract.setProvider( web3RpcProvider.currentProvider );

};

PriceOracle.prototype = {

  // Validate Error case
  getPrice: async function(){
    const transactionObject = currContract.methods.getPrice();
    const encodedABI = transactionObject.encodeABI();
    const transactionOutputs = helper.getTransactionOutputs( transactionObject );
    const response = await helper.call(web3RpcProvider, contractAddr, encodedABI, {}, transactionOutputs);
    return Promise.resolve(response[0]);
  },

  decimalPrice: function(){
    return (this.getPrice())/(helper.decimalPrecisionInWei());
  },

  fixedPointIntegerPrice: function(decimalPrice){
    return new BigNumber(web3RpcProvider.toWei(decimalPrice, "ether"));
  },

  setPrice: async function(price){
    logger.info("Input Price: " + price);

    this.validatePrice();

    const encodedABI = currContract.methods.setPrice(price).encodeABI();
    const transactionReceipt = await helper.safeSend(
      web3RpcProvider,
      contractAddr,
      encodedABI,
      senderName
      { gasPrice: GAS_PRICE, gas: GAS_LIMIT }
    );

    logger.info('----------------------------------------------------------------------');
    logger.info(JSON.stringify(transactionReceipt));
    logger.info('----------------------------------------------------------------------');

    return Promise.resolve(transactionReceipt);
  },

  getTokenDecimals: async function(){
    const transactionObject = currContract.methods.tokenDecimals();
    const encodedABI = transactionObject.encodeABI();
    const transactionOutputs = helper.getTransactionOutputs( transactionObject );
    const response = await helper.call(web3RpcProvider, contractAddr, encodedABI, {}, transactionOutputs);
    return Promise.resolve(response[0]);
  },

  getExpirationHeight: async function(){
    const transactionObject = currContract.methods.expirationHeight();
    const encodedABI = transactionObject.encodeABI();
    const transactionOutputs = helper.getTransactionOutputs( transactionObject );
    const response = await helper.call(web3RpcProvider, contractAddr, encodedABI, {}, transactionOutputs);
    return Promise.resolve(response[0]);
  },

  getBaseCurrency: async function(){
    const transactionObject = currContract.methods.baseCurrency();
    const encodedABI = transactionObject.encodeABI();
    const transactionOutputs = helper.getTransactionOutputs( transactionObject );
    const response = await helper.call(web3RpcProvider, contractAddr, encodedABI, {}, transactionOutputs);
    return Promise.resolve(response[0]);
  },

  getQuoteCurrency: async function(){
    const transactionObject = currContract.methods.quoteCurrency();
    const encodedABI = transactionObject.encodeABI();
    const transactionOutputs = helper.getTransactionOutputs( transactionObject );
    const response = await helper.call(web3RpcProvider, contractAddr, encodedABI, {}, transactionOutputs);
    return Promise.resolve(response[0]);
  }


};