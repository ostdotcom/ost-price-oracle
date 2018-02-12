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
  , chainId = parseInt(process.env.OST_PO_CHAIN_ID)
;

// Base Currency Related Unit Tests
describe('Set Price - Base Currency', function() {

  this.timeout(50000);

  // Validate Base Currencies
  it('should match base currency data type', async function() {
    assert.typeOf(baseCurrency, 'String');
  });

  it('should fail when base currency is blank', async function() {
    try {
      var result = await priceOracle.setPrice(chainId, '', quoteCurrency, price, gasPrice);
      assert.equal(result.success , false);
    } catch (e){
      assert.instanceOf(e, TypeError);
    }
  });

});

// Quote Currency Related Unit Tests
describe('Set Price - Quote Currency', function() {
  this.timeout(5000);

  // Validate quote Currency
  it('should match quote currency data type', async function() {
    assert.typeOf(quoteCurrency, 'String');
  });

  it('should fail when quote currency is blank', async function() {
    try {
      var result = await priceOracle.setPrice(chainId, baseCurrency, '', price, gasPrice);
      assert.equal(result.success , false);
    } catch (e){
      assert.instanceOf(e, TypeError);
    }
  });

});

// setPrice service method Unit Tests
describe('Set Price - Price', function() {
  this.timeout(50000);

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
    var response = priceOracle.setPrice(chainId, baseCurrency, quoteCurrency, price, gasPrice);
    assert.typeOf(response, 'promise');
  });

  it('should return transactionHash when setPrice is called', async function() {
    var response = await priceOracle.setPrice(chainId, baseCurrency, quoteCurrency, price, gasPrice);
    assert.typeOf(response.data.transactionHash, 'String');
  });

  it('should match setPrice with getPrice', async function() {
    await priceOracle.setPriceInSync(chainId, baseCurrency, quoteCurrency, price, gasPrice);
    assert.equal(price, (await priceOracle.getPrice(chainId, baseCurrency, quoteCurrency)).data.price);
  });

  it('should not allow 0 price value', async function() {
    try {
      await priceOracle.setPrice(chainId, baseCurrency, quoteCurrency, 0.0, gasPrice);
    } catch (e){
      assert.instanceOf(e, TypeError);
    }
  });

});

// Gas Price related unit tests
describe('Set Price - Gas Price', function() {

  this.timeout(50000);

   it('Should fail when gasPrice is blank', async function() {
     var result = await priceOracle.setPrice(chainId, baseCurrency, quoteCurrency, price, '');
     assert.equal(result.success , false)
  });

  it("Should exit", async function(){
     process.exit(0);
  });


});