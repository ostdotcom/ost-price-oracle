'use strict';
/**
 * Deployment helper.
 *
 * @module lib/helpers/setup/DeployAndSetOps
 */
const rootPrefix = '../../..',
  AbiBinProvider = require(rootPrefix + '/lib/AbiBinProvider'),
  logger = require(rootPrefix + '/lib/logger/customConsoleLogger'),
  contractNameConstants = require(rootPrefix + '/lib/globalConstant/contractName');

// Declare variables.
const ContractName = contractNameConstants.priceOracle;

/**
 * Class for deploying and setting ops contract.
 *
 * @class
 */
class DeployHelper {
  /**
   * Constructor for deploying and setting ops contract.
   *
   * @constructor
   */
  constructor() {
    const oThis = this;

    oThis.abiBinProvider = new AbiBinProvider();
  }

  /**
   * Deploy and set ops contract.
   *
   * @param {Object} web3
   * @param {String} deployerAddress
   * @param {String} opsAddress
   * @param {String} baseCurrency
   * @param {String} quoteCurrency
   * @param {Object} txOptions
   * @param {String} txOptions.gasPrice
   * @param {String} txOptions.gas
   * @param {String/Number} txOptions.chainId
   *
   * @return {Promise<{contractAddress}>}
   */
  async deployAndSetOps(web3, deployerAddress, opsAddress, baseCurrency, quoteCurrency, txOptions) {
    const oThis = this;

    const contractDeployTxReceipt = await oThis.deployOpsContract(
        web3,
        deployerAddress,
        baseCurrency,
        quoteCurrency,
        txOptions
      ),
      contractAddress = contractDeployTxReceipt.contractAddress;

    await oThis.setOpsAddress(web3, opsAddress, contractAddress, txOptions);

    return Promise.resolve({
      contractAddress: contractAddress
    });
  }

  /**
   * Deploy ops contract.
   *
   * @param {Object} web3
   * @param {String} deployerAddress
   * @param {String} baseCurrency
   * @param {String} quoteCurrency
   * @param {Object} txOptions
   * @param {String} txOptions.gasPrice
   * @param {String} txOptions.gas
   * @param {String/Number} txOptions.chainId
   *
   * @return {*}
   */
  deployOpsContract(web3, deployerAddress, baseCurrency, quoteCurrency, txOptions) {
    const oThis = this;

    let txReceipt = {},
      tx = oThis.deployRawTx(web3, deployerAddress, baseCurrency, quoteCurrency, txOptions);

    logger.log('Deploying Price Oracle contract.');

    return tx
      .send(txOptions)
      .on('transactionHash', function(transactionHash) {
        logger.win('\t - Transaction hash:', transactionHash);
      })
      .on('error', function(error) {
        logger.error('\t !! Error !!', error, '\n\t !! ERROR !!\n');
        return Promise.reject(error);
      })
      .on('receipt', function(receipt) {
        txReceipt = receipt;
        logger.win('\t - Receipt:', JSON.stringify(receipt), '\n');
      })
      .then(function() {
        const contractAddress = txReceipt.contractAddress;
        logger.log(`\t - Contract Address:`, contractAddress);

        return Promise.resolve({
          contractAddress: contractAddress
        });
      });
  }

  /**
   * Get deployment raw transaction.
   *
   * @param {Object} web3
   * @param {String} deployerAddress
   * @param {String} baseCurrency
   * @param {String} quoteCurrency
   * @param {Object} txOptions
   * @param {String} txOptions.gasPrice
   * @param {String} txOptions.gas
   * @param {String/Number} txOptions.chainId
   *
   * @return {*}
   */
  deployRawTx(web3, deployerAddress, baseCurrency, quoteCurrency, txOptions) {
    const oThis = this;

    oThis._validateDeploysOpsConfig(web3, deployerAddress, baseCurrency, quoteCurrency, txOptions);

    const abiBinProvider = oThis.abiBinProvider,
      abi = abiBinProvider.getABI(ContractName),
      bin = abiBinProvider.getBIN(ContractName),
      constructorArgs = [web3.utils.asciiToHex(baseCurrency), web3.utils.asciiToHex(quoteCurrency)];

    const options = {
      from: deployerAddress,
      gas: txOptions.gas,
      gasPrice: txOptions.gasPrice,
      chainId: txOptions.chainId,
      data: abiBinProvider.getBIN(ContractName)
    };

    options.arguments = constructorArgs;

    const contract = new web3.eth.Contract(abi, null, options); // Address is null since it is not known yet.

    return contract.deploy(
      {
        data: bin,
        arguments: constructorArgs
      },
      options
    );
  }

  /**
   * Set ops address.
   *
   * @param {Object} web3
   * @param {String} opsAddress
   * @param {String} contractAddress
   * @param {Object} txOptions
   * @param {String} txOptions.gasPrice
   * @param {String} txOptions.gas
   * @param {String/Number} txOptions.chainId
   *
   * @return {PromiseLike<{contractAddress: *}> | Promise<{contractAddress: *}> | *}
   */
  setOpsAddress(web3, opsAddress, contractAddress, txOptions) {
    const oThis = this,
      tx = oThis.setOpsAddressTx(web3, opsAddress, contractAddress, txOptions);

    let txReceipt = {};

    logger.log('Setting ops address in price oracle contract.');

    return tx
      .send(txOptions)
      .on('transactionHash', function(transactionHash) {
        logger.win('\t - Transaction hash:', transactionHash);
      })
      .on('error', function(error) {
        logger.error('\t !! Error !!', error, '\n\t !! ERROR !!\n');
        return Promise.reject(error);
      })
      .on('receipt', function(receipt) {
        txReceipt = receipt;
        logger.win('\t - Receipt:', JSON.stringify(receipt), '\n');
      });
  }

  /**
   * Set ops address transaction
   *
   * @param {Object} web3
   * @param {String} opsAddress
   * @param {String} contractAddress
   * @param {Object} txOptions
   * @param {String} txOptions.gasPrice
   * @param {String} txOptions.gas
   * @param {String/Number} txOptions.chainId
   *
   * @return {*}
   */
  setOpsAddressTx(web3, opsAddress, contractAddress, txOptions) {
    const oThis = this;

    oThis._validateSetOpsConfig(web3, opsAddress, contractAddress, txOptions);

    const abiBinProvider = oThis.abiBinProvider,
      abi = abiBinProvider.getABI(ContractName);

    let contract = new web3.eth.Contract(abi, contractAddress, txOptions);

    return contract.methods.setOpsAddress(opsAddress);
  }

  /**
   * Set admin address.
   *
   * @param {Object} web3
   * @param {String} adminAddress
   * @param {String} contractAddress
   * @param {Object} txOptions
   * @param {String} txOptions.gasPrice
   * @param {String} txOptions.gas
   * @param {String/Number} txOptions.chainId
   *
   * @return {PromiseLike<{contractAddress: *}> | Promise<{contractAddress: *}> | *}
   */
  setAdminAddress(web3, adminAddress, contractAddress, txOptions) {
    const oThis = this,
      tx = oThis.setAdminAddressTx(web3, adminAddress, contractAddress, txOptions);

    let txReceipt = {};

    logger.log('Setting admin address in price oracle contract.');

    return tx
      .send(txOptions)
      .on('transactionHash', function(transactionHash) {
        logger.win('\t - Transaction hash:', transactionHash);
      })
      .on('error', function(error) {
        logger.error('\t !! Error !!', error, '\n\t !! ERROR !!\n');
        return Promise.reject(error);
      })
      .on('receipt', function(receipt) {
        txReceipt = receipt;
        logger.win('\t - Receipt:', JSON.stringify(receipt), '\n');
      });
  }

  /**
   * Set admin address transaction
   *
   * @param {Object} web3
   * @param {String} adminAddress
   * @param {String} contractAddress
   * @param {Object} txOptions
   * @param {String} txOptions.gasPrice
   * @param {String} txOptions.gas
   * @param {String/Number} txOptions.chainId
   *
   * @return {*}
   */
  setAdminAddressTx(web3, adminAddress, contractAddress, txOptions) {
    const oThis = this;

    oThis._validateSetAdminConfig(web3, adminAddress, contractAddress, txOptions);

    const abiBinProvider = oThis.abiBinProvider,
      abi = abiBinProvider.getABI(ContractName);

    let contract = new web3.eth.Contract(abi, contractAddress, txOptions);

    return contract.methods.setAdminAddress(adminAddress);
  }

  /**
   * Validate deployOps config.
   *
   * @param {Object} web3
   * @param {String} deployerAddress
   * @param {String} baseCurrency
   * @param {String} quoteCurrency
   * @param {Object} txOptions
   * @param {String} txOptions.gasPrice
   * @param {String} txOptions.gas
   * @param {String/Number} txOptions.chainId
   *
   * @private
   */
  _validateDeploysOpsConfig(web3, deployerAddress, baseCurrency, quoteCurrency, txOptions) {
    if (!web3) {
      throw new Error('Mandatory configuration "web3" missing.');
    }

    if (!deployerAddress) {
      throw new Error('Mandatory configuration "deployerAddress" missing.');
    }

    if (!baseCurrency) {
      throw new Error('Mandatory configuration "baseCurrency" missing.');
    }

    if (!quoteCurrency) {
      throw new Error('Mandatory configuration "quoteCurrency" missing.');
    }

    if (!txOptions) {
      throw new Error('Mandatory configuration "txOptions" missing.');
    }

    if (!txOptions.gasPrice) {
      throw new Error('Mandatory configuration "txOptions.gasPrice" missing.');
    }

    if (!txOptions.gas) {
      throw new Error('Mandatory configuration "txOptions.gas" missing.');
    }

    if (!txOptions.chainId) {
      throw new Error('Mandatory configuration "txOptions.chainId" missing.');
    }
  }

  /**
   * Validate setOps config.
   *
   * @param {Object} web3
   * @param {String} opsAddress
   * @param {String} contractAddress
   * @param {Object} txOptions
   * @param {String} txOptions.gasPrice
   * @param {String} txOptions.gas
   * @param {String/Number} txOptions.chainId
   *
   * @private
   */
  _validateSetOpsConfig(web3, opsAddress, contractAddress, txOptions) {
    if (!web3) {
      throw new Error('Mandatory configuration "web3" missing.');
    }

    if (!opsAddress) {
      throw new Error('Mandatory configuration "opsAddress" missing.');
    }

    if (!contractAddress) {
      throw new Error('Mandatory configuration "contractAddress" missing.');
    }

    if (!txOptions) {
      throw new Error('Mandatory configuration "txOptions" missing.');
    }

    if (!txOptions.gasPrice) {
      throw new Error('Mandatory configuration "txOptions.gasPrice" missing.');
    }

    if (!txOptions.gas) {
      throw new Error('Mandatory configuration "txOptions.gas" missing.');
    }

    if (!txOptions.chainId) {
      throw new Error('Mandatory configuration "txOptions.chainId" missing.');
    }
  }

  /**
   * Validate setAdmin config.
   *
   * @param {Object} web3
   * @param {String} opsAddress
   * @param {String} contractAddress
   * @param {Object} txOptions
   * @param {String} txOptions.gasPrice
   * @param {String} txOptions.gas
   * @param {String/Number} txOptions.chainId
   *
   * @private
   */
  _validateSetAdminConfig(web3, opsAddress, contractAddress, txOptions) {
    if (!web3) {
      throw new Error('Mandatory configuration "web3" missing.');
    }

    if (!opsAddress) {
      throw new Error('Mandatory configuration "opsAddress" missing.');
    }

    if (!contractAddress) {
      throw new Error('Mandatory configuration "contractAddress" missing.');
    }

    if (!txOptions) {
      throw new Error('Mandatory configuration "txOptions" missing.');
    }

    if (!txOptions.gasPrice) {
      throw new Error('Mandatory configuration "txOptions.gasPrice" missing.');
    }

    if (!txOptions.gas) {
      throw new Error('Mandatory configuration "txOptions.gas" missing.');
    }

    if (!txOptions.chainId) {
      throw new Error('Mandatory configuration "txOptions.chainId" missing.');
    }
  }
}

module.exports = DeployHelper;
