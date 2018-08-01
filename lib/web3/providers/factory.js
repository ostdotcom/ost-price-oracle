'use strict';

/**
 * Web3 Provider Factory
 *
 * @module lib/web3/providers/factory
 */

const OSTBase = require('@openstfoundation/openst-base');

const rootPrefix        = '../../..',
      InstanceComposer  = require(rootPrefix + '/instance_composer'),
      OstWeb3Pool       = OSTBase.OstWeb3Pool
;

require(rootPrefix + '/config/core_constants');

/**
 * Constructor for Deploy Utility Registrar contract
 *
 * @constructor
 */
const Web3ProviderFactoryKlass = function(configStrategy, instanceComposer) {};

Web3ProviderFactoryKlass.prototype = {
  /**
   * Type RPC
   *
   * @constant {string}
   *
   */
  typeRPC: 'rpc',

  /**
   * Type WS
   *
   * @constant {string}
   *
   */
  typeWS: 'ws',


  /**
   * Perform
   *
   * @param {string} chain - chain name - value / utility
   * @param {string} type - provider type - ws / rpc
   *
   * @return {web3Provider}
   */
  getProvider: function( type ) {
    const oThis = this;
    if( oThis.typeWS  == type ){
      return oThis.getWsProvider();
    }else if( oThis.typeRPC  == type ){
      return oThis.getRpcProvider();
    }
    return null;
  },

  getWsProvider : function () {
    const oThis = this,
          coreConstants = oThis.ic().getCoreConstants(),
          config  = { providerOptions: {
                      maxReconnectTries: 20,
                      killOnReconnectFailure: false
                    }}
    ;
    const web3WsProvider = OstWeb3Pool.Factory.getWeb3( coreConstants.OST_UTILITY_GETH_WS_PROVIDER , null , config );
    return web3WsProvider ;
  },

  getRpcProvider: function () {
    const oThis = this,
          coreConstants = oThis.ic().getCoreConstants()
    ;
    const web3RpcProvider = OstWeb3Pool.Factory.getWeb3( coreConstants.OST_UTILITY_GETH_RPC_PROVIDER );
    return web3RpcProvider ;
  },

};

InstanceComposer.register(Web3ProviderFactoryKlass, 'getWeb3ProviderFactory', true);

module.exports = Web3ProviderFactoryKlass;
