'use strict';
/**
 * OpenStCache Provider
 *
 * @module lib/providers/cache
 */

const OSTBase = require('@openstfoundation/openst-base'),
  OpenStCache = require('@openstfoundation/openst-cache'),
  InstanceComposer = OSTBase.InstanceComposer;

const rootPrefix = '../..',
  coreConstants = require(rootPrefix + '/config/coreConstants');

/**
 * Class for shared memcache provider
 *
 * @class
 */
class CacheProvider {
  /**
   * Constructor for shared memcache provider
   *
   * @constructor
   */
  constructor() {}

  /**
   * Get instance of openst-cache.
   *
   * @returns {Object}
   */
  getInstance() {
    const oThis = this;

    return OpenStCache.getInstance(oThis.ic().configStrategy.cache);
  }
}

InstanceComposer.registerAsObject(CacheProvider, coreConstants.icNameSpace, 'cacheProvider', true);

module.exports = CacheProvider;
