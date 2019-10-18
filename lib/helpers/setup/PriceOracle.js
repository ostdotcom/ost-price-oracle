const BigNumber = require('bignumber.js');

const rootPrefix = '../../..',
  AbiBinProvider = require(rootPrefix + '/lib/AbiBinProvider'),
  apiErrorConfig = require(rootPrefix + '/config/apiErrorConfig'),
  responseHelper = require(rootPrefix + '/lib/formatter/response'),
  logger = require(rootPrefix + '/lib/logger/customConsoleLogger'),
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
 * @class PriceOracle
 */
class PriceOracle {
  /**
   * Constructor for price oracle helper.
   *
   * @param {object} web3: web3 instance object
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
   * @param {object} web3
   * @param {string} opsAddress
   * @param {string} baseCurrency
   * @param {string} quoteCurrency
   * @param {string} priceOracleContractAddress
   * @param {string} price
   * @param {string} gasPrice
   * @param {number} gas
   *
   * @returns {*}
   */
  setPrice(web3, opsAddress, baseCurrency, quoteCurrency, priceOracleContractAddress, price, gasPrice, gas) {
    const oThis = this;

    const txResponse = oThis.setPriceTx(web3, baseCurrency, quoteCurrency, priceOracleContractAddress, price, gasPrice),
      contractAddress = txResponse.contractAddress,
      encodedABI = txResponse.encodedABI;

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
   * Set price transaction.
   *
   * @param {object} web3
   * @param {string} baseCurrency
   * @param {string} quoteCurrency
   * @param {string} priceOracleContractAddress
   * @param {string} price
   * @param {string} gasPrice
   *
   * @returns {*}
   */
  setPriceTx(web3, baseCurrency, quoteCurrency, priceOracleContractAddress, price, gasPrice) {
    const oThis = this;

    const response = oThis._setPriceData(
      web3,
      baseCurrency,
      quoteCurrency,
      priceOracleContractAddress,
      price,
      gasPrice
    );

    if (!response.success) {
      return Promise.resolve(response);
    }

    return {
      contractAddress: response.data.contractAddress,
      encodedABI: response.data.encodedABI
    };
  }

  /**
   * Validate currency.
   *
   * @param {string} baseCurrency: base Currency
   * @param {string} quoteCurrency: quote Currency
   *
   * @returns {object}
   * @private
   */
  _validateCurrency(baseCurrency, quoteCurrency) {
    if (!baseCurrency) {
      const errorParams = {
        internal_error_identifier: 'l_h_s_po_1',
        api_error_identifier: 'base_currency_invalid',
        error_config: errorConfig,
        debug_options: {}
      };

      return responseHelper.error(errorParams);
    }

    if (!quoteCurrency) {
      const errorParams = {
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
   * @param {object} web3
   * @param {string} baseCurrency
   * @param {string} quoteCurrency
   * @param {string} priceOracleContractAddress
   * @param {string} price
   * @param {string} gasPrice
   *
   * @returns {*}
   * @private
   */
  _setPriceData(web3, baseCurrency, quoteCurrency, priceOracleContractAddress, price, gasPrice) {
    const oThis = this;

    const response = oThis._validateCurrency(baseCurrency, quoteCurrency);

    if (!response.success) {
      return response;
    }

    const priceVal = new BigNumber(price);

    if (priceVal.equals(0)) {
      const errorParams = {
        internal_error_identifier: 'l_h_s_po_3',
        api_error_identifier: 'zero_price_invalid',
        error_config: errorConfig,
        debug_options: {}
      };

      return responseHelper.error(errorParams);
    }
    if (priceVal.isInt() === false) {
      const errorParams = {
        internal_error_identifier: 'l_h_s_po_4',
        api_error_identifier: 'price_invalid',
        error_config: errorConfig,
        debug_options: {}
      };

      return responseHelper.error(errorParams);
    }

    if (!gasPrice) {
      const errorParams = {
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
   * @param {object} web3
   * @param {string} contractAddress
   *
   * @returns {*}
   * @private
   */
  _setContractInstance(web3, contractAddress) {
    const oThis = this;

    const abiBinProvider = oThis.abiBinProvider,
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
   * @param {object} web3
   *
   * @returns {*}
   */
  decimalPrecisionInWei(web3) {
    return web3.utils.toWei('1', 'ether');
  }

  /**
   * Return decimal price.
   *
   * @param {object} web3
   * @param {string} contractAddress
   *
   * @returns {Promise<any>}
   */
  decimalPrice(web3, contractAddress) {
    const oThis = this;

    return new Promise(function(onResolve) {
      oThis.getPrice(web3, contractAddress).then(function(response) {
        const decimalVal = response / oThis.decimalPrecisionInWei(web3);

        return onResolve(responseHelper.successWithData({ price: decimalVal }));
      });
    });
  }

  /**
   * Get fixed point integer for a decimal value in precision of wei.
   *
   * @param {number} decimalPrice: decimal price e.g. 1.2
   *
   * @returns {BigNumber}
   */
  fixedPointIntegerPrice(decimalPrice) {
    const oThis = this;

    const fixedPointIntegerPrice = new BigNumber(oThis.web3.utils.toWei(decimalPrice.toString(), 'ether'));

    return responseHelper.successWithData({ price: fixedPointIntegerPrice });
  }

  /**
   * Get price.
   *
   * @param {object} web3
   * @param {string} priceOracleContractAddress
   *
   * @returns {*}
   */
  getPrice(web3, priceOracleContractAddress) {
    const oThis = this;

    const abiBinProvider = oThis.abiBinProvider,
      abi = abiBinProvider.getABI(ContractName),
      contract = new web3.eth.Contract(abi, priceOracleContractAddress);

    return contract.methods.getPrice().call(function(err, res) {
      if (err) {
        return Promise.reject(err);
      }

      return Promise.resolve(res);
    });
  }

  /**
   * Get quote currency.
   *
   * @param {object} web3
   * @param {string} priceOracleContractAddress
   *
   * @returns {*}
   */
  getQuoteCurrency(web3, priceOracleContractAddress) {
    const oThis = this;

    const abiBinProvider = oThis.abiBinProvider,
      abi = abiBinProvider.getABI(ContractName),
      contract = new web3.eth.Contract(abi, priceOracleContractAddress);

    return contract.methods.quoteCurrency().call(function(err, res) {
      if (err) {
        return Promise.reject(err);
      }

      return Promise.resolve(new web3.utils.hexToAscii(res));
    });
  }

  /**
   * Get base currency.
   *
   * @param {object} web3
   * @param {string} priceOracleContractAddress
   *
   * @returns {*}
   */
  getBaseCurrency(web3, priceOracleContractAddress) {
    const oThis = this;

    const abiBinProvider = oThis.abiBinProvider,
      abi = abiBinProvider.getABI(ContractName),
      contract = new web3.eth.Contract(abi, priceOracleContractAddress);

    return contract.methods.baseCurrency().call(function(err, res) {
      if (err) {
        return Promise.reject(err);
      }

      return Promise.resolve(new web3.utils.hexToAscii(res));
    });
  }

  /**
   * Get expiration height.
   *
   * @param {object} web3
   * @param {string} priceOracleContractAddress
   *
   * @returns {*}
   */
  getExpirationHeight(web3, priceOracleContractAddress) {
    const oThis = this;

    const abiBinProvider = oThis.abiBinProvider,
      abi = abiBinProvider.getABI(ContractName),
      contract = new web3.eth.Contract(abi, priceOracleContractAddress);

    return contract.methods.expirationHeight().call(function(err, res) {
      if (err) {
        return Promise.reject(err);
      }

      return Promise.resolve(res);
    });
  }

  /**
   * Get price validity duration.
   *
   * @param {object} web3
   * @param {string} priceOracleContractAddress
   *
   * @returns {*}
   */
  getPriceValidityDuration(web3, priceOracleContractAddress) {
    const oThis = this;

    const abiBinProvider = oThis.abiBinProvider,
      abi = abiBinProvider.getABI(ContractName),
      contract = new web3.eth.Contract(abi, priceOracleContractAddress);

    return contract.methods.priceValidityDuration().call(function(err, res) {
      if (err) {
        return Promise.reject(err);
      }

      return Promise.resolve(res);
    });
  }
}

module.exports = PriceOracle;
