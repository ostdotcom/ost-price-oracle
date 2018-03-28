"use strict";

/**
 * Deploy Price Oracle contract and set ops
 *
 * @module tools/deploy/deploy_and_set_ops
 */
const rootPrefix = '../..'
  , web3Provider = require(rootPrefix + '/lib/web3/providers/ws')
  , deployHelper = require(rootPrefix + '/tools/deploy/helper')
  , coreAddresses = require(rootPrefix + '/config/core_addresses')
  , coreConstants = require(rootPrefix + '/config/core_constants')
  , logger = require(rootPrefix + '/helpers/custom_console_logger')
  , OpsManagedContract = require(rootPrefix + "/lib/contract_interact/ops_managed_contract")
  ;

// Different addresses used for deployment
const deployerName = "deployer"
  , deployerAddress = coreAddresses.getAddressForUser(deployerName)
  , opsName = "ops"
  , opsAdress = coreAddresses.getAddressForUser(opsName)
;

/**
 * Deploy Price Oracle contract and set ops
 *
 * @constructor
 */
const DeploySetOpsKlass = function(){};

DeploySetOpsKlass.prototype = {

  /**
   * Method to deploy price oracle contract and set ops
   *
   * @param {object} options
   * @param {number} options.gasPrice - Gas Price to use
   * @param {string} options.baseCurrency - Base Currency to set in contract
   * @param {string} options.quoteCurrency - Quote Currency to set in contract
   */
  perform: async function(options){

    const baseCurrency = (options || {}).baseCurrency
      , quoteCurrency = (options || {}).quoteCurrency
      , gasPrice = (options || {}).gasPrice
      ;

    var contractName = 'priceOracle'
      , contractAbi = coreAddresses.getAbiForContract(contractName)
      , contractBin = coreAddresses.getBinForContract(contractName)
    ;

    // Contract deployment options for value chain
    const deploymentOptions = {
      gas: coreConstants.OST_UTILITY_GAS_LIMIT,
      gasPrice: gasPrice
    };

    var constructorArgs = [
      web3Provider.utils.asciiToHex(baseCurrency),
      web3Provider.utils.asciiToHex(quoteCurrency)
    ];

    logger.info("Deploying contract: "+contractName);

    var contractDeployTxReceipt = await deployHelper.perform(
      contractName,
      web3Provider,
      contractAbi,
      contractBin,
      deployerName,
      deploymentOptions,
      constructorArgs
    );

    logger.info(contractDeployTxReceipt);
    logger.info(contractName+ " Deployed ");
    const contractAddress = contractDeployTxReceipt.receipt.contractAddress;
    logger.win(contractName+ " Contract Address: "+contractAddress);

    logger.info("Setting Ops Address to: " + opsAdress);
    var opsManaged = new OpsManagedContract(contractAddress, gasPrice);
    var result = await opsManaged.setOpsAddress(deployerName, opsAdress, deploymentOptions);
    logger.info(result);
    var contractOpsAddress = await opsManaged.getOpsAddress();
    logger.info("Ops Address Set to: " + opsAdress);

    return Promise.resolve({contractAddress: contractAddress});

  }
};

module.exports = DeploySetOpsKlass;