"use strict";
/*
 * Helper
 *
 * * Author: Abhay
 * * Date: 22/11/2017
 * * Reviewed by:
 */

const mustache = require('mustache')
  , fs = require('fs')
  , Path = require('path')
  , ostPoVarsSourceFile = './ost_po_vars.sh'
;

const rootPrefix          = '../..'
    , logger              = require(rootPrefix + '/helpers/custom_console_logger')
    , configStrategyPath  = rootPrefix + "/tools/config_strategy.json"
;

const ostPoPriceOracleTemplate = "export OST_UTILITY_PRICE_ORACLES='{{{ost_utility_price_oracles}}}'\n";

const populateVars = {

  renderAndPopulate: function (type, vars) {
    var oThis = this
      , renderData = ''
    ;
    try {
      if (type == 'ost_utility_price_oracles') {
        renderData = mustache.render(ostPoPriceOracleTemplate, vars);
        oThis.populateConfigStrategy( 'OST_UTILITY_PRICE_ORACLES' , vars['ost_utility_price_oracles'] );
      }
      else {
        logger.error(" Invalid Template Type To render");
        process.exit(1);
      }
      var existingSourceFileData = fs.readFileSync(Path.join(__dirname, '/' + ostPoVarsSourceFile));
      var dataToWrite = existingSourceFileData.toString() + "\n\n" + renderData;
      //logger.debug("ENV Constants to Write");
      //logger.debug(dataToWrite);
      fs.writeFileSync(Path.join(__dirname, '/' + ostPoVarsSourceFile), dataToWrite);
    } catch(e) {
      logger.error("Error Reading and Populating Source File");
      logger.error(e);
      process.exit(1);
    }

  },

  /**
   * Add Configuration to OpenST Platform JSON Config File
   *
   * @param {string} configKey - Config Key
   * @param {string} configValue - Config Value
   */
  populateConfigStrategy: function( configKey, configValue ) {

    // Read Config
    let content = fs.readFileSync( configStrategyPath ),
        config  = JSON.parse( content );

    if( typeof configValue == "string" ){
      configValue = JSON.parse( configValue );
    }

    // Update the config.
    config[configKey] = configValue;
    content = JSON.stringify(config, null, 2);

    // Write Config
    fs.writeFileSync( configStrategyPath, content );
  }

};


module.exports = populateVars;
