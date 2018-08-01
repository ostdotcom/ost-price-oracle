'use strict';

/**
 * Deploy Price Oracle contract and set ops
 *
 * @module tools/deploy/deploy_and_set_ops
 */
const rootPrefix = '../..',
  logger = require(rootPrefix + '/helpers/custom_console_logger'),
  InstanceComposer = require(rootPrefix + '/instance_composer');

require(rootPrefix + '/lib/web3/providers/factory');
require(rootPrefix + '/tools/deploy/helper');
require(rootPrefix + '/config/core_addresses');
require(rootPrefix + '/config/core_constants');
require(rootPrefix + '/lib/contract_interact/ops_managed_contract');

// Different addresses used for deployment
const deployerName = 'deployer',
  contractName = 'priceOracle',
  opsName = 'ops';

/**
 * Deploy Price Oracle contract and set ops
 *
 * @constructor
 */
const DeploySetOpsKlass = function(configStrategy, instanceComposer) {};

DeploySetOpsKlass.prototype = {
  /**
   * Method to deploy price oracle contract and set ops
   *
   * @param {object} options
   * @param {number} options.gasPrice - Gas Price to use
   * @param {string} options.baseCurrency - Base Currency to set in contract
   * @param {string} options.quoteCurrency - Quote Currency to set in contract
   */
  perform: async function(options) {
    const oThis = this,
      coreAddresses = oThis.ic().getCoreAddresses(),
      web3ProviderFactory = oThis.ic().getWeb3ProviderFactory(),
      web3Provider = web3ProviderFactory.getProvider('ws'),
      coreConstants = oThis.ic().getCoreConstants(),
      deployHelper = oThis.ic().getDeployHelper(),
      OpsManagedContract = oThis.ic().getOpsManagedInteractClass(),
      baseCurrency = (options || {}).baseCurrency,
      quoteCurrency = (options || {}).quoteCurrency,
      gasPrice = (options || {}).gasPrice,
      opsAdress = coreAddresses.getAddressForUser(opsName);

    var contractAbi = coreAddresses.getAbiForContract(contractName),
      contractBin = coreAddresses.getBinForContract(contractName);

    // Contract deployment options for value chain
    const deploymentOptions = {
      gas: coreConstants.OST_UTILITY_GAS_LIMIT,
      gasPrice: gasPrice
    };

    var constructorArgs = [web3Provider.utils.asciiToHex(baseCurrency), web3Provider.utils.asciiToHex(quoteCurrency)];

    logger.debug('Deploying contract: ' + contractName);

    var contractDeployTxReceipt = await deployHelper.perform(
      contractName,
      web3Provider,
      contractAbi,
      contractBin,
      deployerName,
      deploymentOptions,
      constructorArgs
    );

    logger.debug(contractDeployTxReceipt);
    logger.debug(contractName + ' Deployed ');
    const contractAddress = contractDeployTxReceipt.receipt.contractAddress;
    logger.win(contractName + ' Contract Address: ' + contractAddress);

    logger.debug('Setting Ops Address to: ' + opsAdress);
    var opsManaged = new OpsManagedContract(contractAddress, gasPrice);
    var result = await opsManaged.setOpsAddress(deployerName, opsAdress, deploymentOptions);
    logger.debug(result);
    var contractOpsAddress = await opsManaged.getOpsAddress();
    logger.debug('Ops Address Set to: ' + opsAdress);

    return Promise.resolve({ contractAddress: contractAddress });
  }
};

InstanceComposer.registerShadowableClass(DeploySetOpsKlass, 'getDeploySetOpsKlass');
module.exports = DeploySetOpsKlass;
