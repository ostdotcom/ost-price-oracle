'use strict';

/**
 * List of all addresses and there respective abi, bin, passphrase
 * required for platform.
 *
 * And helper methods to access this information using human readable
 * names.
 *
 */

const rootPrefix = '..',
  InstanceComposer = require(rootPrefix + '/instance_composer');

const coreAbis = require(rootPrefix + '/config/core_abis'),
  coreBins = require(rootPrefix + '/config/core_bins');

require(rootPrefix + '/config/core_constants');

const CoreAddresses = function(configStrategy, instanceComposer) {
  const oThis = this;
  oThis._buildAllAddresses(configStrategy);
};

// helper methods to access difference addresses and their respective details
CoreAddresses.prototype = {
  getAddressForUser: function(userName) {
    const oThis = this;
    return oThis.allAddresses.users[userName].address;
  },

  getPassphraseForUser: function(userName) {
    const oThis = this;
    return oThis.allAddresses.users[userName].passphrase;
  },

  getAddressForContract: function(contractName) {
    var oThis = this,
      contractAddress = oThis.allAddresses.contracts[contractName].address;
    if (Array.isArray(contractAddress)) {
      throw 'Please pass valid contractName to get contract address for: ' + contractName;
    }
    return contractAddress;
  },

  // This must return array of addresses.
  getAddressesForContract: function(contractName) {
    var oThis = this,
      contractAddresses = oThis.allAddresses.contracts[contractName].address;
    if (!contractAddresses || !Array.isArray(contractAddresses) || contractAddresses.length === 0) {
      throw 'Please pass valid contractName to get contract address for: ' + contractName;
    }
    return contractAddresses;
  },

  getContractNameFor: function(contractAddr) {
    const oThis = this,
      addrToContractNameMap = oThis._getAddrToContractNameMap();
    return addrToContractNameMap[(contractAddr || '').toLowerCase()];
  },

  getAbiForContract: function(contractName) {
    const oThis = this;
    return oThis.allAddresses.contracts[contractName].abi;
  },

  getBinForContract: function(contractName) {
    const oThis = this;
    return oThis.allAddresses.contracts[contractName].bin;
  },

  getAddressOfPriceOracleContract: function(baseCurrency, quoteCurrency) {
    let oThis = this,
      coreConstants = oThis.ic().getCoreConstants();
    return coreConstants.OST_UTILITY_PRICE_ORACLES[baseCurrency][quoteCurrency];
  },

  allAddresses: null,
  _buildAllAddresses: function(configStrategy) {
    var oThis = this;

    oThis.allAddresses = {
      users: {
        deployer: {
          address: configStrategy.OST_UTILITY_DEPLOYER_ADDR,
          passphrase: configStrategy.OST_UTILITY_DEPLOYER_PASSPHRASE
        },

        ops: {
          address: configStrategy.OST_UTILITY_OPS_ADDR,
          passphrase: configStrategy.OST_UTILITY_OPS_PASSPHRASE
        }
      },

      contracts: {
        priceOracle: {
          abi: coreAbis.priceOracle,
          bin: coreBins.priceOracle
        },

        opsManaged: {
          abi: coreAbis.opsManaged,
          bin: coreBins.opsManaged
        }
      }
    };
  },

  _addrToContractNameMap: null,
  _getAddrToContractNameMap: function() {
    const oThis = this;

    if (oThis._addrToContractNameMap) {
      return oThis._addrToContractNameMap;
    }
    // oThis._addrToContractNameMap will be always updated by object reference
    const addrToContractNameMap = (oThis._addrToContractNameMap = {}),
      contractNames = oThis.allAddresses.contracts;

    for (var contractName in contractNames) {
      var addr = contractNames[contractName].address;

      if (Array.isArray(addr)) {
        for (var i = 0; i < addr.length; i++) {
          addrToContractNameMap[addr[i].toLowerCase()] = contractName;
        }
      } else if (addr !== null && typeof addr !== 'undefined') {
        addrToContractNameMap[addr.toLowerCase()] = contractName;
      }
    }

    return addrToContractNameMap;
  }
};

InstanceComposer.register(CoreAddresses, 'getCoreAddresses', true);
module.exports = CoreAddresses;
