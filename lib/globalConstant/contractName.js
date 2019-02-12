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
    return 'PriceOracle';
  }

  static get opsManaged() {
    return 'OpsManaged';
  }
}

module.exports = ContractName;
