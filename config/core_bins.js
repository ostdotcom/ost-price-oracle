"use strict";

/*
 * Load all contract bin files
 *
 */

const fs = require('fs')
  , path = require('path')
;

function readFile(filePath, options) {
  filePath = path.join(__dirname, '/' + filePath);
  return fs.readFileSync(filePath, options || "utf8");
}

const rootPrefix = "..";

const coreBins = {
  priceOracle: readFile(rootPrefix + '/contracts/bin/PriceOracle.bin', 'utf8'),
  opsManaged: readFile(rootPrefix + '/contracts/bin/OpsManaged.bin', "utf8")
};

module.exports = coreBins;
