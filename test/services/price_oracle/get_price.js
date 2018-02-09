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
;

// getPrice service method unit tests
describe('Get Price', function() {

  it('should fail when baseCurrency is blank', async function() {
    try {
      await priceOracle.getPrice('', quoteCurrency);
    } catch (e){
      assert.instanceOf(e, TypeError);
    }
  });

  it('should fail when quoteCurrency is blank', async function() {
    try {
      await priceOracle.getPrice(baseCurrency, '');
    } catch (e){
      assert.instanceOf(e, Error);
    }
  });

  it('should fail when both baseCurrency and quoteCurrency is blank', async function() {
    try {
      await priceOracle.getPrice('', '');
    } catch (e){
      assert.instanceOf(e, TypeError);
    }
  });

  it('should match setPrice equals getPrice', async function() {
    assert.equal(price, await priceOracle.getPrice(baseCurrency, quoteCurrency));
  });

  it('should match that response of getPrice should be Promise', async function() {
    assert.typeOf(priceOracle.getPrice(baseCurrency, quoteCurrency), 'Object');
  });

  it('should validate that response of getPrice should be fixed point integer', async function() {
    var price = await priceOracle.getPrice(baseCurrency, quoteCurrency);
    assert.equal(price%1, 0);
  });


});
