const fs = require('fs'),
  web3 = require('web3'),
  { assert } = require('chai'),
  Tx = require('ethereumjs-tx'),
  Web3Util = require('web3-utils');

const rootPrefix = '../..',
  AbiBinProvider = require(rootPrefix + '/lib/AbiBinProvider'),
  PriceOracleHelper = require(rootPrefix + '/index').PriceOracleHelper,
  testConstants = require(rootPrefix + '/test/scripts/constants');

// Declare variables.
const wsEndpoint = testConstants.auxWsProvider,
  workerAddress = testConstants.auxOpsAddress,
  workerPrivateKey = testConstants.auxOpsPrivateKey,
  auxChainId = testConstants.auxChainId,
  web3Provider = new web3(wsEndpoint),
  baseCurrency = 'OST',
  quoteCurrency = 'USD',
  zeroGasPrice = '0x0',
  decimalPrice = '0.0275966338',
  priceInWei = '27596633800000000',
  updatePricePointsGas = 80000,
  contractName = 'PriceOracle',
  abiTxOptions = {
    chainId: auxChainId
  },
  priceOracleContractAddress = fs.readFileSync(testConstants.tempFilePath).toString(),
  priceOracleAbi = new AbiBinProvider().getABI(contractName),
  contractObject = new web3Provider.eth.Contract(priceOracleAbi, priceOracleContractAddress, abiTxOptions);

describe('Price Oracle Methods', () => {
  it('should set price in contract', async () => {
    // Get transaction object.
    const txResponse = new PriceOracleHelper(web3Provider).setPriceTx(
      web3Provider,
      baseCurrency,
      quoteCurrency,
      priceOracleContractAddress,
      priceInWei,
      zeroGasPrice
    );

    // Prepare params for transaction.
    const encodedABI = txResponse.encodedABI,
      txParams = {
        from: workerAddress,
        to: priceOracleContractAddress,
        value: '0x0',
        data: encodedABI,
        gas: Web3Util.toHex(updatePricePointsGas),
        gasPrice: zeroGasPrice,
        chainId: Number(auxChainId),
        nonce: await web3Provider.eth.getTransactionCount(workerAddress)
      };

    // Prepare transaction object.
    const privateKeyObj = new Buffer.from(workerPrivateKey, 'hex'),
      tx = new Tx(txParams);

    tx.sign(privateKeyObj);

    const serializedTx = tx.serialize(),
      signedTransaction = '0x' + serializedTx.toString('hex');

    // Submit transaction on geth.
    await web3Provider.eth.sendSignedTransaction(signedTransaction);

    // Fetch price from geth.
    const priceFromGeth = await contractObject.methods.getPrice().call();

    assert(Number(priceFromGeth), Number(priceInWei));
  });

  it('should get decimal price from contract', async () => {
    // Get transaction object.
    const conversionRate = await new PriceOracleHelper(web3Provider).decimalPrice(
      web3Provider,
      priceOracleContractAddress
    );

    assert(Number(conversionRate.data.price), Number(decimalPrice));
  });

  it('should get price from contract', async () => {
    // Get transaction object.
    const priceFromContract = await new PriceOracleHelper(web3Provider).getPrice(
      web3Provider,
      priceOracleContractAddress
    );

    assert(Number(priceFromContract), Number(priceInWei));
  });

  it('should get quote currency from contract', async () => {
    // Get transaction object.
    const quoteCurrencyFromContract = await new PriceOracleHelper(web3Provider).getQuoteCurrency(
      web3Provider,
      priceOracleContractAddress
    );

    assert(quoteCurrencyFromContract, quoteCurrency);
  });

  it('should get base currency from contract', async () => {
    // Get transaction object.
    const baseCurrencyFromContract = await new PriceOracleHelper(web3Provider).getBaseCurrency(
      web3Provider,
      priceOracleContractAddress
    );

    assert(baseCurrencyFromContract, baseCurrency);
  });
});
