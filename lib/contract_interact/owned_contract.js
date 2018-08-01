'use strict';

/**
 *
 * This is a utility file which would be used for executing all methods on Owned Contract.<br><br>
 *
 * @module lib/contract_interact/owned_contract
 *
 */

const rootPrefix = '../..',
  InstanceComposer = require(rootPrefix + '/instance_composer');

require(rootPrefix + '/lib/contract_interact/helper');

/**
 * @constructor
 *
 * @param {String} contractAddress - address where Contract has been deployed
 * @param {String} web3Provider - web3 provider of network where currContract has been deployed
 * @param {String} currContract - Contract Instance
 * @param {String} defaultGasPrice - default Gas Price
 *
 */
const OwnedContractKlass = function(contractAddress, web3Provider, currContract, defaultGasPrice) {
  this.contractAddress = contractAddress;
  this.web3Provider = web3Provider;
  this.currContract = currContract;
  this.defaultGasPrice = defaultGasPrice;
  this.currContract.options.address = contractAddress;
  //this.currContract.setProvider( web3Provider.currentProvider );
};

OwnedContractKlass.prototype = {
  /**
   * Initiate Ownership of currContract
   *
   * @param {String} senderName - Sender of this Transaction
   * @param {String} proposedOwner - address to which ownership needs to be transferred
   * @param {Object} customOptions - custom params of this transaction
   *
   * @return {Promise}
   *
   */
  initiateOwnerShipTransfer: async function(senderName, proposedOwner, customOptions) {
    const oThis = this,
      helper = oThis.ic().getContractInteractHelper(),
      encodedABI = this.currContract.methods.initiateOwnershipTransfer(proposedOwner).encodeABI();

    var options = { gasPrice: this.defaultGasPrice };

    Object.assign(options, customOptions);

    const transactionResponse = await helper.safeSend(
      this.web3Provider,
      this.contractAddress,
      encodedABI,
      senderName,
      options
    );

    return Promise.resolve(transactionResponse);
  },

  /**
   * Get address of Owner of currContract
   *
   * @return {Promise}
   *
   */
  getOwner: async function() {
    const oThis = this,
      helper = oThis.ic().getContractInteractHelper();

    const transactionObject = this.currContract.methods.proposedOwner();
    const encodedABI = transactionObject.encodeABI();
    const transactionOutputs = helper.getTransactionOutputs(transactionObject);
    const response = await helper.call(this.web3Provider, this.contractAddress, encodedABI, {}, transactionOutputs);
    return Promise.resolve(response[0]);
  }
};

InstanceComposer.registerShadowableClass(OwnedContractKlass, 'getOwnedContractClass');

module.exports = OwnedContractKlass;
