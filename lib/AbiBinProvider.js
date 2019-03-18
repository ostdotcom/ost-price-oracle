'use strict';
/**
 * ABI and BIN provider
 *
 * @module lib/AbiBinProvider
 */

//__NOT_FOR_WEB__BEGIN__
const fs = require('fs'),
  path = require('path');
//__NOT_FOR_WEB__END__

const rootPrefix = '..';

//__NOT_FOR_WEB__BEGIN__
const DEFAULT_ABI_FOLDER_PATH = path.resolve(__dirname, rootPrefix + '/contracts/abi/'),
  DEFAULT_BIN_FOLDER_PATH = path.resolve(__dirname, rootPrefix + '/contracts/bin/');
//__NOT_FOR_WEB__END__

/**
 * Class for abi and bin provider.
 *
 * @class
 */
class AbiBinProvider {
  /**
   * Constructor for abi and bin provider.
   *
   * @constructor
   */
  constructor() {
    const oThis = this;

    oThis.abiFolderPath = DEFAULT_ABI_FOLDER_PATH;
    oThis.binFolderPath = DEFAULT_BIN_FOLDER_PATH;
  }

  /**
   * Getter to get ABI for a contract.
   *
   * @param {String} contractName
   *
   * @return {*}
   */
  getABI(contractName) {
    const oThis = this;

    //__NOT_FOR_WEB__BEGIN__
    const fPath = path.resolve(oThis.abiFolderPath, contractName + '.abi'),
      abiFileContent = fs.readFileSync(fPath, 'utf8');
    return JSON.parse(abiFileContent);
    //__NOT_FOR_WEB__END__
  }

  /**
   * Getter to get BIN for a contract.
   *
   * @param {String} contractName
   *
   * @return {*}
   */
  getBIN(contractName) {
    const oThis = this;

    //__NOT_FOR_WEB__BEGIN__
    const fPath = path.resolve(oThis.binFolderPath, contractName + '.bin');
    let bin = fs.readFileSync(fPath, 'utf8');
    if (typeof bin === 'string' && bin.indexOf('0x') != 0) {
      bin = '0x' + bin;
    }
    //__NOT_FOR_WEB__END__
    return bin;
  }
}

module.exports = AbiBinProvider;
