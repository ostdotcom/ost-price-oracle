"use strict";

/**
 *
 * This is a utility file which would be used for executing all methods on OpsManaged Contract.<br><br>
 *
 * @module lib/contract_interact/ops_managed_contract
 *
 */

const rootPrefix      = '../..'
    , InstanceComposer  = require(rootPrefix + "/instance_composer")
    , OwnedContract     = require(rootPrefix + '/lib/contract_interact/owned_contract')
    , contractName      = 'opsManaged'
;

require(rootPrefix + '/lib/contract_interact/helper');
require(rootPrefix + '/lib/web3/providers/factory');
require(rootPrefix + '/config/core_addresses');

/**
 * @constructor
 * @augments OwnedContract
 *
 * @param {String} contractAddress - address where Contract has been deployed
 * @param {String} web3Provider - web3 provider of network where currContract has been deployed
 * @param {String} currContract - Contract Instance
 * @param {String} defaultGasPrice - default Gas Price
 *
 */
const OpsManagedContract = function (contractAddress, defaultGasPrice) {
  const  oThis = this ,
         web3ProviderFactory  = oThis.ic().getWeb3ProviderFactory(),
         web3Provider         = web3ProviderFactory.getProvider('ws'),
         coreAddresses        = oThis.ic().getCoreAddresses() ,
         contractAbi          = coreAddresses.getAbiForContract(contractName),
         currContract         = new web3Provider.eth.Contract(contractAbi)
  ;

  oThis.contractAddress = contractAddress;
  oThis.web3Provider = web3Provider;
  oThis.currContract = currContract;
  oThis.defaultGasPrice = defaultGasPrice;
  oThis.currContract.options.address = contractAddress;
  //this.currContract.setProvider( web3Provider.currentProvider );

  OwnedContract.call(this, contractAddress, web3Provider, currContract, defaultGasPrice);
};

OpsManagedContract.prototype = Object.create(OwnedContract.prototype);

OpsManagedContract.prototype.constructor = OpsManagedContract;

/**
 * Get currContract's Ops Address
 *
 * @return {Result}
 *
 */
OpsManagedContract.prototype.getOpsAddress = async function() {
  const oThis   = this ,
        helper  = oThis.ic().getContractInteractHelper()
  ;

  const transactionObject = this.currContract.methods.opsAddress();
  const encodedABI = transactionObject.encodeABI();
  const transactionOutputs = helper.getTransactionOutputs( transactionObject );
  const response = await helper.call(oThis.web3Provider, this.contractAddress, encodedABI, {}, transactionOutputs);
  return Promise.resolve(response[0]);
};

/**
 * Set currContract's Ops Address
 *
 * @param {String} defaultGasPrice - default Gas Price
 * @param {String} opsAddress - address which is to be made Ops Address of currContract
 * @param {Object} customOptions - custom params for this transaction
 *
 * @return {Promise}
 *
 */
OpsManagedContract.prototype.setOpsAddress = async function(senderName, opsAddress, customOptions) {

  const oThis   = this ,
        helper  = oThis.ic().getContractInteractHelper()
  ;

  const encodedABI = this.currContract.methods.setOpsAddress(opsAddress).encodeABI();

  var options = { gasPrice: this.defaultGasPrice };

  Object.assign(options,customOptions);

  const transactionReceipt = await helper.safeSend(
    oThis.web3Provider,
    oThis.contractAddress,
    encodedABI,
    senderName,
    options
  );

  return Promise.resolve(transactionReceipt);
};

InstanceComposer.registerShadowableClass(OpsManagedContract, "getOpsManagedInteractClass");

module.exports = OpsManagedContract;