'use strict';
/**
 * PriceOracle has setup and deploy related tasks related with Price Oracle contract.
 *
 * @module lib/helpers/setup/PriceOracle
 */

const BigNumber = require('bignumber.js');

const rootPrefix = '../../..',
  AbiBinProvider = require(rootPrefix + '/lib/AbiBinProvider'),
  responseHelper = require(rootPrefix + '/lib/formatter/response'),
  logger = require(rootPrefix + '/lib/logger/customConsoleLogger'),
  apiErrorConfig = require(rootPrefix + '/config/apiErrorConfig'),
  paramErrorConfig = require(rootPrefix + '/config/paramErrorConfig'),
  contractNameConstants = require(rootPrefix + '/lib/globalConstant/contractName');

// Declare variables.
const ContractName = contractNameConstants.priceOracle,
  errorConfig = {
    param_error_config: paramErrorConfig,
    api_error_config: apiErrorConfig
  };

/**
 * Class for price oracle helper.
 *
 * @class
 */
class PriceOracle {
  /**
   * Constructor for price oracle helper.
   *
   * @param web3 - web3 instance object
   *
   * @constructor
   */
  constructor(web3) {
    const oThis = this;

    oThis.web3 = web3;

    oThis.abiBinProvider = new AbiBinProvider();
  }

  /**
   * Set price in contract.
   *
   * @param {Object} web3
   * @param {String} opsAddress
   * @param {String} baseCurrency
   * @param {String} quoteCurrency
   * @param {String} priceOracleContractAddress
   * @param {String} price
   * @param {String} gasPrice
   * @param {Number} gas
   *
   * @return {*}
   */
  setPrice(web3, opsAddress, baseCurrency, quoteCurrency, priceOracleContractAddress, price, gasPrice, gas) {
    const oThis = this,
      txResponse = oThis.setPriceTx(web3, baseCurrency, quoteCurrency, priceOracleContractAddress, price, gasPrice),
      contractAddress = txResponse.contractAddress,
      encodedABI = txResponse.encodedABI;

    console.log('=====contractAddress===', contractAddress);
    console.log('=====encodedABI===', encodedABI);

    const txParams = {
      from: opsAddress,
      to: contractAddress,
      data: encodedABI,
      gas: gas,
      gasPrice: gasPrice
    };

    let txReceipt = {};
    return web3.eth
      .sendTransaction(txParams, function(error) {
        if (error) {
          logger.error('sendTxAsyncFromAddr :: sendTransaction :: error :: \n\t', error);
          return Promise.reject(error);
        }
      })
      .on('transactionHash', (txHash) => {
        logger.log('transactionHash: ', txHash);
        return Promise.resolve(txHash);
      })
      .on('receipt', function(receipt) {
        txReceipt = receipt;
        logger.win('\t - Receipt:', JSON.stringify(receipt), '\n');
      })
      .then(function() {
        return Promise.resolve(responseHelper.successWithData({ transactionReceipt: txReceipt }));
      });
  }

  /**
   * Set price transaction
   *
   * @param {Object} web3
   * @param {String} baseCurrency
   * @param {String} quoteCurrency
   * @param {String} priceOracleContractAddress
   * @param {String} price
   * @param {String} gasPrice
   *
   * @return {*}
   */
  setPriceTx(web3, baseCurrency, quoteCurrency, priceOracleContractAddress, price, gasPrice) {
    const oThis = this,
      response = oThis._setPriceData(web3, baseCurrency, quoteCurrency, priceOracleContractAddress, price, gasPrice);

    console.log('=======response======', response);

    if (!response.success) {
      return Promise.resolve(response);
    }

    return {
      contractAddress: response.data.contractAddress,
      encodedABI: response.data.encodedABI
    };
  }

  /**
   * Validate Currency
   *
   * @param {String} baseCurrency: base Currency
   * @param {String} quoteCurrency: quote Currency
   *
   * @return {Object}
   *
   * @private
   */
  _validateCurrency(baseCurrency, quoteCurrency) {
    if (!baseCurrency) {
      let errorParams = {
        internal_error_identifier: 'l_h_s_po_1',
        api_error_identifier: 'base_currency_invalid',
        error_config: errorConfig,
        debug_options: {}
      };
      return responseHelper.error(errorParams);
    }
    if (!quoteCurrency) {
      let errorParams = {
        internal_error_identifier: 'l_h_s_po_2',
        api_error_identifier: 'quote_currency_invalid',
        error_config: errorConfig,
        debug_options: {}
      };
      return responseHelper.error(errorParams);
    }
    return responseHelper.successWithData({});
  }

  /**
   * Set price data.
   *
   * @param {Object} web3
   * @param {String} baseCurrency
   * @param {String} quoteCurrency
   * @param {String} priceOracleContractAddress
   * @param {String} price
   * @param {String} gasPrice
   *
   * @return {*}
   *
   * @private
   */
  _setPriceData(web3, baseCurrency, quoteCurrency, priceOracleContractAddress, price, gasPrice) {
    const oThis = this;

    let response = oThis._validateCurrency(baseCurrency, quoteCurrency);

    if (!response.success) {
      return response;
    }

    const priceVal = new BigNumber(price);

    if (priceVal.equals(0)) {
      let errorParams = {
        internal_error_identifier: 'l_h_s_po_3',
        api_error_identifier: 'zero_price_invalid',
        error_config: errorConfig,
        debug_options: {}
      };
      return responseHelper.error(errorParams);
    }
    if (priceVal.isInt() === false) {
      let errorParams = {
        internal_error_identifier: 'l_h_s_po_4',
        api_error_identifier: 'price_invalid',
        error_config: errorConfig,
        debug_options: {}
      };
      return responseHelper.error(errorParams);
    }

    if (gasPrice === undefined || gasPrice === '') {
      let errorParams = {
        internal_error_identifier: 'l_h_s_po_5',
        api_error_identifier: 'gas_price_invalid',
        error_config: errorConfig,
        debug_options: {}
      };
      return responseHelper.error(errorParams);
    }

    const contractAddress = priceOracleContractAddress,
      result = oThis._setContractInstance(web3, contractAddress),
      encodedABI = result.data.currentContract.methods.setPrice(priceVal.toString(10)).encodeABI();

    return responseHelper.successWithData({
      contractAddress: contractAddress,
      encodedABI: encodedABI
    });
  }

  /**
   * Set contract instance.
   *
   * @param {Object} web3
   * @param {String} contractAddress
   *
   * @return {*}
   *
   * @private
   */
  _setContractInstance(web3, contractAddress) {
    const oThis = this,
      abiBinProvider = oThis.abiBinProvider,
      abi = abiBinProvider.getABI(ContractName),
      currContract = new web3.eth.Contract(abi);

    currContract.options.address = contractAddress;

    return responseHelper.successWithData({
      currentContract: currContract
    });
  }

  /**
   * Return decimal value in wei.
   *
   * @param {Object} web3
   *
   * @return {*}
   */
  decimalPrecisionInWei(web3) {
    return web3.utils.toWei('1', 'ether');
  }

  /**
   * Return decimal price.
   *
   * @param {Object} web3
   * @param {String} contractAddress
   *
   * @return {Promise<any>}
   */
  decimalPrice(web3, contractAddress) {
    const oThis = this;

    return new Promise(function(onResolve) {
      oThis.getPrice(web3, contractAddress).then(function(response) {
        const decimalVal = response.price / oThis.decimalPrecisionInWei(web3);
        return onResolve(responseHelper.successWithData({ price: decimalVal }));
      });
    });
  }

  /**
   * Get fixed point integer for a decimal value in precision of wei.
   *
   * @param {Number} decimalPrice: decimal price e.g. 1.2
   *
   * @return {BigNumber}
   */
  fixedPointIntegerPrice(decimalPrice) {
    const oThis = this,
      fixedPointIntegerPrice = new BigNumber(oThis.web3.utils.toWei(decimalPrice.toString(), 'ether'));

    return responseHelper.successWithData({ price: fixedPointIntegerPrice });
  }

  /**
   * Get price
   *
   * @param {Object} web3
   * @param {String} priceOracleContractAddress
   *
   * @return {*}
   */
  getPrice(web3, priceOracleContractAddress) {
    const oThis = this,
      abiBinProvider = oThis.abiBinProvider,
      abi = abiBinProvider.getABI(ContractName),
      contract = new web3.eth.Contract(abi, priceOracleContractAddress);

    return contract.methods.getPrice().call(function(err, res) {
      if (err) return Promise.reject(err);
      return Promise.resolve(res);
    });
  }
}

module.exports = PriceOracle;
