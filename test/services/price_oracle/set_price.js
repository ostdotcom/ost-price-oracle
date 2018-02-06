// Load external packages
const chai = require('chai')
  , assert = chai.assert;

// Load services
const rootPrefix = "../../.."
  , OSTPriceOracle = require(rootPrefix+'/index')
  , priceOracle = OSTPriceOracle.priceOracle
  , web3RpcProvider = require(rootPrefix+'/lib/web3/providers/rpc')
  , BigNumber = require('bignumber.js')
;

const baseCurrency='OST'
  , quoteCurrency='USD'
  , decimalPrice = parseFloat(process.env.OST_PO_SET_PRICE)
  , price = new BigNumber(web3RpcProvider.utils.toWei(decimalPrice.toString(), "ether")).toNumber()
  , gasPrice = '0x12A05F200'
;

// Base Currency Related Unit Tests
describe('Set Price - Base Currency', function() {

  // Validate Base Currencies
  it('should match base currency data type', async function() {
    assert.typeOf(baseCurrency, 'String');
  });

  it('should fail when base currency is blank', async function() {
    try {
      await priceOracle.setPrice('', quoteCurrency, price, gasPrice);
    } catch (e){
      assert.instanceOf(e, TypeError);
    }
  });

});

// Quote Currency Related Unit Tests
describe('Set Price - Quote Currency', function() {
  // Validate quote Currency
  it('should match quote currency data type', async function() {
    assert.typeOf(quoteCurrency, 'String');
  });

  it('should fail when quote currency is blank', async function() {
    try {
      await priceOracle.setPrice(baseCurrency, '', price, gasPrice);
    } catch (e){
      assert.instanceOf(e, TypeError);
    }
  });

});

// setPrice service method Unit Tests
describe('Set Price - Price', function() {

  it('should fail when price is not decimal', async function() {
    assert.equal(price%1, 0);
  });

  it('should fail when price is decimal', async function() {
    var decimalPrice = 5.2;
    assert.notEqual(decimalPrice%1, 0);
  });

  it('should fail when price is negative number', async function() {
    var negativePrice = -5.0;
    assert.notEqual(Math.abs(negativePrice), negativePrice);
  });

  it('should return promise when setPrice is called', async function() {
    var response = priceOracle.setPrice(baseCurrency, quoteCurrency, price, gasPrice);
    assert.typeOf(response, 'Object');
  });

  it('should return transactionHash when setPrice is called', async function() {
    var response = await priceOracle.setPrice(baseCurrency, quoteCurrency, price, gasPrice);
    assert.typeOf(response, 'String');
  });

  it('should match setPrice with getPrice', async function() {
    this.timeout(10000);
    await priceOracle.setPriceInSync(baseCurrency, quoteCurrency, price, gasPrice);
    assert.equal(price, await priceOracle.getPrice(baseCurrency, quoteCurrency));
  });

  it('should not allow 0 price value', async function() {
    try {
      await priceOracle.setPrice(baseCurrency, quoteCurrency, 0.0, gasPrice);
    } catch (e){
      assert.instanceOf(e, TypeError);
    }
  });

});

// Gas Price related unit tests
describe('Set Price - Gas Price', function() {
   it('Should fail when gasPrice is blank', async function() {
    try {
      await priceOracle.setPrice(baseCurrency, quoteCurrency, price, '');
    } catch (e){
      assert.instanceOf(e, TypeError);
    }
  });

});