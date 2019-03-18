const fs = require('fs'),
  web3 = require('web3'),
  { assert } = require('chai'),
  Tx = require('ethereumjs-tx'),
  Web3Util = require('web3-utils');

const rootPrefix = '../..',
  AbiBinProvider = require(rootPrefix + '/lib/AbiBinProvider'),
  testConstants = require(rootPrefix + '/test/scripts/constants'),
  DeployAndSetOpsAndAdminHelper = require(rootPrefix + '/index').DeployAndSetOpsAndAdminHelper,
  deployAndSetOpsAndAdminHelper = new DeployAndSetOpsAndAdminHelper();

// Declare variables.
const wsEndpoint = testConstants.auxWsProvider,
  ownerAddress = testConstants.auxOwnerAddress,
  workerAddress = testConstants.auxOpsAddress,
  adminAddress = testConstants.auxAdminAddress,
  ownerPrivateKey = testConstants.auxOwnerPrivateKey,
  auxChainId = testConstants.auxChainId,
  web3Provider = new web3(wsEndpoint),
  baseCurrency = 'OST',
  quoteCurrency = 'USD',
  zeroGasPrice = '0x0',
  deployPriceOracleContractGas = 650000,
  setPriceOracleContractOpsAddressGas = 60000,
  setPriceOracleContractAdminAddressGas = 60000,
  contractName = 'PriceOracle',
  abiTxOptions = {
    chainId: auxChainId
  };

describe('Price Oracle Deployment', () => {
  let contractAddress, priceOracleAbi, contractObject;

  it('should deploy price oracle contract', async () => {
    // Prepare txOptions.
    const txOptions = {
      gasPrice: zeroGasPrice,
      gas: Web3Util.toHex(deployPriceOracleContractGas),
      chainId: Number(auxChainId),
      value: '0x0',
      nonce: await web3Provider.eth.getTransactionCount(ownerAddress)
    };

    // Get raw transaction object.
    const txObject = deployAndSetOpsAndAdminHelper.deployRawTx(
      web3Provider,
      ownerAddress,
      baseCurrency,
      quoteCurrency,
      txOptions
    );
    txOptions.data = txObject.encodeABI();

    const privateKeyObj = new Buffer.from(ownerPrivateKey, 'hex'), // Prepare transaction object.
      tx = new Tx(txOptions);

    tx.sign(privateKeyObj);

    const serializedTx = tx.serialize(),
      signedTransaction = '0x' + serializedTx.toString('hex');

    // Submit transaction on geth.
    const transactionReceipt = await web3Provider.eth.sendSignedTransaction(signedTransaction);

    contractAddress = transactionReceipt.contractAddress;
    priceOracleAbi = new AbiBinProvider().getABI(contractName);
    contractObject = new web3Provider.eth.Contract(priceOracleAbi, contractAddress, abiTxOptions);

    fs.writeFile(testConstants.tempFilePath, contractAddress, function(err) {
      if (err) console.log(err);
      console.log('Successfully wrote price oracle contract address to file.');
    });

    assert(contractAddress !== null);
  });

  it('should set Ops address in price oracle contract', async () => {
    // Prepare txOptions.
    const txOptions = {
      gasPrice: zeroGasPrice,
      gas: Web3Util.toHex(setPriceOracleContractOpsAddressGas),
      chainId: Number(auxChainId),
      value: '0x0',
      nonce: await web3Provider.eth.getTransactionCount(ownerAddress),
      to: contractAddress
    };

    // Get raw transaction object.
    const txObject = deployAndSetOpsAndAdminHelper.setOpsAddressTx(
      web3Provider,
      workerAddress,
      contractAddress,
      txOptions
    );
    txOptions['data'] = txObject.encodeABI();

    // Prepare transaction object.
    const privateKeyObj = new Buffer.from(ownerPrivateKey, 'hex'),
      tx = new Tx(txOptions);

    tx.sign(privateKeyObj);

    const serializedTx = tx.serialize(),
      signedTransaction = '0x' + serializedTx.toString('hex');

    // Submit transaction on geth.
    await web3Provider.eth.sendSignedTransaction(signedTransaction);

    // Fetch ops address from geth.
    const opsAddressFromGeth = await contractObject.methods.opsAddress().call();

    assert.equal(opsAddressFromGeth, testConstants.auxOpsAddress);
  });

  it('should set admin address in price oracle contract', async () => {
    // Prepare txOptions.
    const txOptions = {
      gasPrice: zeroGasPrice,
      gas: Web3Util.toHex(setPriceOracleContractAdminAddressGas),
      chainId: Number(auxChainId),
      value: '0x0',
      nonce: await web3Provider.eth.getTransactionCount(ownerAddress),
      to: contractAddress
    };

    // Get raw transaction object.
    const txObject = deployAndSetOpsAndAdminHelper.setAdminAddressTx(
      web3Provider,
      adminAddress,
      contractAddress,
      txOptions
    );
    txOptions['data'] = txObject.encodeABI();

    // Prepare transaction object.
    const privateKeyObj = new Buffer.from(ownerPrivateKey, 'hex'),
      tx = new Tx(txOptions);

    tx.sign(privateKeyObj);

    const serializedTx = tx.serialize(),
      signedTransaction = '0x' + serializedTx.toString('hex');

    // Submit transaction on geth.
    await web3Provider.eth.sendSignedTransaction(signedTransaction);

    // Fetch admin address from geth.
    const adminAddressFromGeth = await contractObject.methods.adminAddress().call();

    assert.equal(adminAddressFromGeth, testConstants.auxAdminAddress);
  });
});
