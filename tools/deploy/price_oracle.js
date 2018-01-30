"use strict";

/**
 * This is script for deploying PriceOracle contract on any chain.<br><br>
 *
 *   Prerequisite:
 *    <ol>
 *       <li>Deployer Address</li>
 *     </ol>
 *
 *   These are the following steps:<br>
 *     <ol>
 *       <li>Deploy PriceOracle contract</li>
 *       <li>Constructor expects base Currency and quote Currency as argument</li>
 *       <li>Set Ops Address of contract to ops key</li>
 *     </ol>
 *
 *
 * @module tools/deploy/price_oracle
 */

const readline = require('readline');

const rootPrefix = '../..'
  , web3RpcProvider = require(rootPrefix + '/lib/web3/providers/rpc')
  , deployHelper = require(rootPrefix + '/tools/deploy/helper')
  , coreConstants = require(rootPrefix + '/config/core_constants')
  , coreAddresses = require(rootPrefix + '/config/core_addresses')
  , prompts = readline.createInterface(process.stdin, process.stdout)
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
 * Validation Method
 *
 * @param {Array} arguments
 *
 * @return {}
 */
const validate = function(argv) {
  if (argv[2] === undefined || argv[2] == '' || argv[3] === undefined || argv[3] == ''){
    logger.error("Mandatory Parameters baseCurrency/quoteCurrency are missing!");
    process.exit(0);
  }

  if (argv[4] === undefined || argv[4] == '') {
    logger.error("Gas Price is mandatory!");
    process.exit(0);
  }
}

/**
 * It is the main performer method of this deployment script
 *
 * @param {Array} arguments
 *
 * @return {}
 */
const performer = async function (argv) {

  validate(argv);

  const baseCurrency = argv[2].trim()
    , quoteCurrency = argv[3].trim()
    , gasPrice = argv[4].trim()
    , travis_ci_enabled_value = (argv[4] != undefined) ? argv[4].trim() : ''
    , is_travis_ci_enabled = (travis_ci_enabled_value === 'travis')
    ;
  // Contract deployment options for value chain
  const deploymentOptions = {
    gas: coreConstants.OST_PO_GAS_LIMIT,
    gasPrice: gasPrice
  };

  logger.info("Base Currency: " + baseCurrency);
  logger.info("Quote Currency: " + quoteCurrency);
  logger.info("gas Price: " + gasPrice);
  logger.info("Travis CI enabled Status: " + is_travis_ci_enabled);
  logger.info("Deployer Address: " + deployerAddress);
  logger.info("Ops Address: " + opsAdress);

  if (is_travis_ci_enabled === false ){
    await new Promise(
      function (onResolve, onReject) {
        prompts.question("Please verify all above details. Do you want to proceed? [Y/N]", function (intent) {
          if (intent === 'Y') {
            logger.info('Great! Proceeding deployment.');
            prompts.close();
            onResolve();
          } else {
            logger.error('Exiting deployment scripts. Change the enviroment variables and re-run.');
            process.exit(1);
          }
        });
      }
    );
  } else {
    prompts.close();
  }

  var contractName = 'priceOracle'
    , contractAbi = coreAddresses.getAbiForContract(contractName)
    , contractBin = coreAddresses.getBinForContract(contractName)
    ;

  var constructorArgs = [
    web3RpcProvider.utils.asciiToHex(baseCurrency),
    web3RpcProvider.utils.asciiToHex(quoteCurrency)
  ]

  logger.info("Deploying contract: "+contractName);

  var contractDeployTxReceipt = await deployHelper.perform(
    contractName,
    web3RpcProvider,
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
};

// process.argv[2] == travis means proceed deployment without prompt else show prompt
performer(process.argv);