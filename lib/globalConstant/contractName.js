'use strict';
/**
 * Contract name constants
 *
 * @module lib/globalConstant/contractName
 */

/**
 * Class for fetching contract name
 *
 * @class
 */
class ContractName {
  /**
   * Constructor for fetching contract name
   *
   * @constructor
   */
  constructor() {}

  static get priceOracle() {
    return 'priceOracle';
  }

  static get opsManaged() {
    return 'opsManaged';
  }
}

module.exports = ContractName;
