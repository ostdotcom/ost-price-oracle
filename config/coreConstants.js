'use strict';
/**
 * Load all the core constants.
 *
 * @module config/coreConstants
 */


class CoreConstants {
  constructor() {};

  /**
   * Debug enabled
   *
   * @returns {*}
   */
  get DEBUG_ENABLED() {
    return process.env.OST_DEBUG_ENABLED;
  }

  /**
   * Returns package name
   *
   * @return {String}
   */
  get icNameSpace() {
    return 'ost-price-oracle';
  }
}

module.exports = CoreConstants;
