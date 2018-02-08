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
  , ostPoVarsSourceFile = './ost_po_vars.sh';

const ostPoPriceOracleTemplate = "export OST_PO_PRICE_ORACLES='{{{ost_po_price_oracles}}}'\n";

const populateVars = {

  renderAndPopulate: function (type, vars) {
    var renderData = '';
    try {
      if (type == 'ost_po_price_oracles') {
        renderData = mustache.render(ostPoPriceOracleTemplate, vars);
      }
      else {
        console.error(" Invalid Template Type To render");
        process.exit(1);
      }
      var existingSourceFileData = fs.readFileSync(Path.join(__dirname, '/' + ostPoVarsSourceFile));
      var dataToWrite = existingSourceFileData.toString() + "\n\n" + renderData;
      //console.log("ENV Constants to Write");
      //console.log(dataToWrite);
      fs.writeFileSync(Path.join(__dirname, '/' + ostPoVarsSourceFile), dataToWrite);
    } catch(e) {
      console.error("Error Reading and Populating Source File");
      console.error(e);
      process.exit(1);
    }

  },

};

module.exports = populateVars;
