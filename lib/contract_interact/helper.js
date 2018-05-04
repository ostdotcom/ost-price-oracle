"use strict";

/**
 * This is utility class for contract interacts<br><br>
 *
 * Ref: {@link module:ContractHelper}
 *
 * @module lib/contract_helper/helper
 */

const rootPrefix = '../..'
  , coreAddresses = require(rootPrefix+'/config/core_addresses')
  , coreConstants = require(rootPrefix + '/config/core_constants')
  , web3EventsDecoder = require(rootPrefix+'/lib/web3/events/decoder')
  , logger = require(rootPrefix + '/helpers/custom_console_logger')
  , web3Provider = require(rootPrefix+'/lib/web3/providers/ws')
  , BigNumber = require('bignumber.js')
  , responseHelper = require(rootPrefix + '/lib/formatter/response')
  , paramErrorConfig = require(rootPrefix + '/config/param_error_config')
  , apiErrorConfig = require(rootPrefix + '/config/api_error_config')
;

const errorConfig = {
  param_error_config: paramErrorConfig,
  api_error_config: apiErrorConfig
};

const openSTCache = require('@openstfoundation/openst-cache')
  , cacheImplementer = new openSTCache.cache(coreConstants.CACHING_ENGINE, true)
  , cacheKeys = openSTCache.OpenSTCacheKeys

/**
 * Deploy Helper class to perform deploy
 *
 * @exports lib/contract_helper/helper
 */
const helper = {

  /**
   * Call methods (execute methods which DO NOT modify state of contracts)
   *
   * @param {Web3} web3Provider - It could be value chain or utility chain provider
   * @param {String} currContractAddr - current contract address
   * @param {Object} encodeABI - encoded method ABI data
   * @param {Object} [options] - optional params
   * @param {Object} [transactionOutputs] - optional transactionOutputs
   *
   * @return {Promise}
   *
   */
  call: function (web3Provider, currContractAddr, encodeABI, options, transactionOutputs) {
    var params = {
      to: currContractAddr,
      data: encodeABI
    };
    if (options) {
      Object.assign(params,options)
    }
    return web3Provider.eth.call(params)
      .then(function(response){
        //logger.debug(response);
        if ( transactionOutputs ) {
          return web3Provider.eth.abi.decodeParameters(transactionOutputs, response);
        } else {
          return response;
        }
      });
  },

  /**
   * get outputs of a given transaction
   *
   * @param {Object} transactionObject - transactionObject is returned from call method.
   *
   * @return {Object}
   *
   */
  getTransactionOutputs: function ( transactionObject ) {
    return transactionObject._method.outputs;
  },

  /**
   * @ignore
   */
  sendTxAsync: function (web3Provider, currContractAddr, encodeABI, senderName, txOptions) {
    const senderAddr = coreAddresses.getAddressForUser(senderName)
          ,senderPassphrase = coreAddresses.getPassphraseForUser(senderName)
    ;

    return helper.sendTxAsyncFromAddr(web3Provider, currContractAddr, encodeABI, senderAddr, senderPassphrase, txOptions);
  },

  /**
   * @ignore
   */
  sendTxAsyncFromAddr: function (web3Provider, currContractAddr, encodeABI, senderAddr, senderPassphrase, txOptions) {
    const txParams = {
      from: senderAddr,
      to: currContractAddr,
      data: encodeABI
    };
    Object.assign(txParams, txOptions);

    logger.debug("sendTxAsyncFromAddr :: Unlock Account", senderAddr);
    return web3Provider.eth.personal.unlockAccount( senderAddr, senderPassphrase)
      .then( _ => {
        var isPromiseSettled = false;
        logger.debug("sendTxAsyncFromAddr :: Unlocked" ,senderAddr );
        return new Promise(async function (onResolve, onReject) { 
          try {
            web3Provider.eth.sendTransaction(txParams ,function (error, result) {
              //THIS CALLBACK IS IMPORTANT -> on('error') Does not explain the reason.

              // logger.debug("sendTransaction :: callback :: error", error);
              // logger.debug("sendTransaction :: callback :: result", result);
              if ( error ) {
                logger.error("sendTxAsyncFromAddr :: sendTransaction :: error :: \n\t", error );
                !isPromiseSettled && onReject( error );
              }
            })
              .on('transactionHash', txHash => {
                logger.debug("sendTxAsyncFromAddr :: sendTransaction :: transactionHash :: txHash ", txHash);
                isPromiseSettled = true;
                onResolve( txHash );
              });
          } catch( ex ) {
            logger.error("sendTxAsyncFromAddr :: sendTransaction :: Exception :: \n\t", JSON.stringify( ex ) );
            onReject( ex );
          }
        });
      })
      .catch( reason => {

        logger.error("sendTxAsyncFromAddr :: catch :: \n\t", reason, "\n\t", JSON.stringify( reason ) );
        return Promise.reject( reason );
      });
  },

  /**
   * Safe Send a transaction (this internally waits for transaction to be mined)
   *
   * @param {Web3} web3Provider - It could be value chain or utility chain provider
   * @param {String} currContractAddr - current contract address
   * @param {String} senderName - name of transaction's sender
   * @param {Object} encodeABI - encoded method ABI data
   * @param {Object} [txOptions] - optional txOptions
   * @param {Object} [addressToNameMap] - optional addressToNameMap
   *
   * @return {Promise}
   *
   */
  safeSend: function (web3Provider, currContractAddr, encodeABI, senderName, txOptions, addressToNameMap) {
    return helper.sendTxAsync(web3Provider, currContractAddr, encodeABI, senderName, txOptions)
    .then(function(transactionHash) {
        return helper.getTxReceipt(web3Provider, transactionHash, addressToNameMap)
        .then(function(txReceipt) {
          if (txReceipt.gasUsed == txOptions.gasPrice) {
            logger.error("safeSend used complete gas gasPrice : " + txOptions.gasPrice);
          }
          return Promise.resolve(txReceipt);
        });
      }
    );
  },

  /**
   * Get Transaction Receipt
   *
   * @param {Web3} web3Provider - It could be value chain or utility chain provider
   * @params {String} {transactionHash} - Transaction Hash
   * @param {Object} [addressToNameMap] - optional addressToNameMap
   *
   * @return {Promise}
   *
   */
  getTxReceipt: function(web3Provider, transactionHash, addressToNameMap) {
    return new Promise (function(onResolve, onReject) {

      var tryReceipt = function() {
        setTimeout( function(){
            web3Provider.eth.getTransactionReceipt(transactionHash).then(handleResponse);
          },
          5000
        );
      };

      var handleResponse = function (response) {
        if (response) {
          const web3EventsDecoderResult = web3EventsDecoder.perform(response, addressToNameMap);
          onResolve(web3EventsDecoderResult);
        } else {
          logger.debug('Waiting for ' + transactionHash + ' to be mined');
          tryReceipt();
        }
      };

      tryReceipt();

    });
  },

  /**
   * * @return {BigNumer} 10^18
   */
  decimalPrecisionInWei: function(){
    return web3Provider.utils.toWei("1", "ether");
  },

  /**
   * Validate Contract Address
   *
   * @param {Hex} contractAddress - contract address
   *
   * @return {ResponseHelper}
   *
   */
  validateContractAddress: function(contractAddress){

    if (!contractAddress){
      let errorParams = {
        internal_error_identifier: 'l_ci_h_vca_1',
        api_error_identifier: 'contract_address_invalid',
        error_config: errorConfig,
        debug_options: {}
      };
      return responseHelper.error(errorParams);
    }
    if (contractAddress === '0x' || contractAddress === '0'){
      let errorParams = {
        internal_error_identifier: 'l_ci_h_vca_2',
        api_error_identifier: 'contract_address_invalid',
        error_config: errorConfig,
        debug_options: {}
      };
      return responseHelper.error(errorParams);
    }

    return responseHelper.successWithData({});
  },

  /**
   * Validate Currency
   *
   * @param {String} baseCurrency - base Currency
   * @param {String} quoteCurrency - quote Currency
   *
   * @return {responseHelper}
   *
   */
  validateCurrency: function(baseCurrency, quoteCurrency){
    if (!baseCurrency) {
      let errorParams = {
        internal_error_identifier: 'l_ci_h_vc_1',
        api_error_identifier: 'base_currency_invalid',
        error_config: errorConfig,
        debug_options: {}
      };
      return responseHelper.error(errorParams);
    }
    if (!quoteCurrency) {
      let errorParams = {
        internal_error_identifier: 'l_ci_po_vc_2',
        api_error_identifier: 'quote_currency_invalid',
        error_config: errorConfig,
        debug_options: {}
      };
      return responseHelper.error(errorParams);
    }
    return responseHelper.successWithData({});
  },

  /**
   * Get Oracle Price Point Cache Key
   *
   * @param {String} chainId - Geth Chain ID
   * @param {Hex} contractAddress - contract address
   *
   * @return {String}
   *
   */
  oraclePricePointKey: function(chainId, contractAddress){
    return cacheKeys.oraclePricePoint(chainId, contractAddress);
  },

  /**
   * Get Oracle Expiration Height Cache key
   *
   * @param {Integer} chainId - Geth Chain ID
   * @param {Hex} contractAddress - contract address
   *
   * @return {String}
   *
   */
  oracleExpirationHeightKey: function(chainId, contractAddress){
    return cacheKeys.oracleExpirationHeight(chainId, contractAddress);
  },

  /**
   * Flush Caches whenever set price is called
   *
   * @param {Integer} chainId - Geth Chain ID
   * @param {Hex} contractAddress - contract address
   *
   */
  flushSetPriceCache: function(chainId, contractAddress){
    return new Promise(function(onResolve, onReject) {
      cacheImplementer.del(helper.oraclePricePointKey(chainId, contractAddress));
      cacheImplementer.del(helper.oracleExpirationHeightKey(chainId, contractAddress));
      onResolve(responseHelper.successWithData({}));
    });
  }


};

module.exports = helper;