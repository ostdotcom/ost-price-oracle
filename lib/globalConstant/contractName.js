/**
 * Class for fetching contract names.
 *
 * @class ContractName
 */
class ContractName {
  /**
   * Returns price oracle contract name.
   *
   * @returns {string}
   */
  static get priceOracle() {
    return 'PriceOracle';
  }

  /**
   * Returns ops managed contract name.
   *
   * @returns {string}
   */
  static get opsManaged() {
    return 'OpsManaged';
  }
}

module.exports = ContractName;
