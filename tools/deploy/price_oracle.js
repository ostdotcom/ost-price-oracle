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

// const rootPrefix = '../..'
//   , coreConstants = require(rootPrefix + '/config/core_constants')
//   , coreAddresses = require(rootPrefix + '/config/core_addresses')
//   , prompts = readline.createInterface(process.stdin, process.stdout)
//   , logger = require(rootPrefix + '/helpers/custom_console_logger')
//   , populateEnvVars = require( rootPrefix + "/test/scripts/populate_vars.js")
//   , DeployAndSetOpsKlass = require(rootPrefix + '/tools/deploy/deploy_and_set_ops')
//   , fs = require('fs')
//   , Path = require('path')
//   ;

const rootPrefix = '../..'

  , prompts = readline.createInterface(process.stdin, process.stdout) //TODO need to confirm
  , logger = require(rootPrefix + '/helpers/custom_console_logger')
  , populateEnvVars = require( rootPrefix + "/test/scripts/populate_vars.js") //TODO need to confirm
  , fs = require('fs')
  , Path = require('path')
  ,  InstanceComposer = require(rootPrefix+ '/instance_composer')
;

require(rootPrefix + '/tools/deploy/deploy_and_set_ops');
require(rootPrefix + '/config/core_constants');
require(rootPrefix + '/config/core_addresses');



/**
 * Validation Method
 *
 * @param {Array} arguments
 *
 * @return {}
 */


  const DeployPriceOracle = function(){

}

  DeployPriceOracle.prototype.validate = function(argv) {
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
 * Validation Method
 *
 * @param {Bool} is_travis_ci_enabled - Run Travis CI or not
 * @param {String} baseCurrency - Base Currency
 * @param {String} quoteCurrency - Quote Currency
 * @param {Hex} contractAddress - contract Address
 *
 * @return {}
 */
DeployPriceOracle.prototype.handleTravis = function(is_travis_ci_enabled, baseCurrency, quoteCurrency, contractAddress) {

  if (is_travis_ci_enabled === true) {
    var ost_price_oracle = '{"'+baseCurrency+'":{"'+quoteCurrency+'":"'+contractAddress+'"}}';
    populateEnvVars.renderAndPopulate('ost_utility_price_oracles', {
        ost_utility_price_oracles: ost_price_oracle
      }
    );
  }
}

/**
 * Write contract address to file based on parameter
 *
 * @param {String} fileName - file name
 * @param {Hex} contractAddress - contract Address
 *
 * @return {}
 */
DeployPriceOracle.prototype.writeContractAddressToFile = function(fileName, contractAddress){
  // Write contract address to file
  if ( fileName != '') {
    fs.writeFileSync(Path.join(__dirname, '/' + fileName), contractAddress);
  }
}

/**
 * It is the main performer method of this deployment script
 *
 * @param {Array} argv - arguments
 * @param {String} argv[2] - Base Currency
 * @param {String} argv[3] - Quote Currency
 * @param {Hex} argv[4] - gas Price
 * @param {String} argv[5] - If Travis CI to run
 * @param {String} argv[6] - File name where contract address needs to write
 *
 *
 * @return {}
 */
DeployPriceOracle.prototype.performer = async function (argv) {

  validate(argv);

  const oThis = this
    , coreConstants = oThis.ic().getCoreConstants()
    , coreAddresses = oThis.ic().getCoreAddresses()
    , DeployAndSetOpsKlass = oThis.ic().DeployAndSetOpsKlass()
    , baseCurrency = argv[2].trim()
    , quoteCurrency = argv[3].trim()
    , gasPrice = argv[4].trim()
    , is_travis_ci_enabled = (argv[5] === 'travis')
    , fileForContractAddress = (argv[6] != undefined) ? argv[6].trim() : ''

    // Different addresses used for deployment
    , deployerName = "deployer"
    , deployerAddress = coreAddresses.getAddressForUser(deployerName)
    , opsName = "ops"
    , opsAdress = coreAddresses.getAddressForUser(opsName)
  ;

0
  ;
  // Contract deployment options for value chain
  const deploymentOptions = {
    gas: coreConstants.OST_UTILITY_GAS_LIMIT,
    gasPrice: gasPrice
  };

  logger.debug("Base Currency: " + baseCurrency);
  logger.debug("Quote Currency: " + quoteCurrency);
  logger.debug("gas Price: " + gasPrice);
  logger.debug("Travis CI enabled Status: " + is_travis_ci_enabled);
  logger.debug("Deployer Address: " + deployerAddress);
  logger.debug("Ops Address: " + opsAdress);
  logger.debug("file to write For ContractAddress: " + fileForContractAddress);

  if (is_travis_ci_enabled === false ){
    await new Promise(
      function (onResolve, onReject) {
        prompts.question("Please verify all above details. Do you want to proceed? [Y/N]", function (intent) {
          if (intent === 'Y') {
            logger.debug('Great! Proceeding deployment.');
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

  var deployObj = new DeployAndSetOpsKlass()
    , response = await deployObj.perform({gasPrice: gasPrice, baseCurrency: baseCurrency, quoteCurrency: quoteCurrency});

  const contractAddress = response.contractAddress;

  handleTravis(is_travis_ci_enabled, baseCurrency, quoteCurrency, contractAddress);
  writeContractAddressToFile(fileForContractAddress, contractAddress);
  process.exit(0);
};

// node tools/deploy/price_oracle.js OST USD 0x12A05F200 '' a.txt
InstanceComposer.register( DeployPriceOracle, "getDeployPriceOracle", true );
module.exports = DeployPriceOracle;
const deployPriceOracle = new DeployPriceOracle();
deployPriceOracle.performer(process.argv);