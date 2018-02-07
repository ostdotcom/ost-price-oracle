"use strict";

/*
 * Load all contract abi files
 *
 */

const fs = require('fs')
  , path = require('path')
;

function parseFile(filePath, options) {
  filePath = path.join(__dirname, '/' + filePath);
  const fileContent = fs.readFileSync(filePath, options || "utf8");
  return JSON.parse(fileContent);
}

const rootPrefix = "..";

const coreAbis = {
  priceOracle: parseFile(rootPrefix + '/contracts/abi/PriceOracle.abi', "utf8"),
  opsManaged: parseFile(rootPrefix + '/contracts/abi/OpsManaged.abi', "utf8")
};

module.exports = coreAbis;
