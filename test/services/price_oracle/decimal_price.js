// Load external packages
const chai = require('chai')
  , assert = chai.assert;

// Load services
const rootPrefix = "../../.."
  , OSTPriceOracle = require(rootPrefix+'/index')
  , priceOracle = OSTPriceOracle.priceOracle
  , logger = require(rootPrefix + '/helpers/custom_console_logger')
;

const baseCurrency='OST'
  , quoteCurrency='USD'
  , decimalPrice = parseFloat(process.env.OST_PO_SET_PRICE)
;

// decimalPrice service method unit tests
describe('Get Price', function() {

  it('should fail when baseCurrency is blank', async function() {
    try {
      await priceOracle.decimalPrice('', quoteCurrency);
    } catch (e){
      assert.instanceOf(e, TypeError);
    }
  });

  it('should fail when quoteCurrency is blank', async function() {
    try {
      await priceOracle.decimalPrice(baseCurrency, '');
    } catch (e){
      assert.instanceOf(e, Error);
    }
  });

  it('should fail when both baseCurrency and quoteCurrency is blank', async function() {
    try {
      await priceOracle.decimalPrice('', '');
    } catch (e){
      assert.instanceOf(e, TypeError);
    }
  });

  it('should match price in decimal value', async function() {
    var contractDecimalPrice = await priceOracle.decimalPrice(baseCurrency, quoteCurrency);
    assert.equal(parseFloat(contractDecimalPrice), decimalPrice);
  });

  it('should match that response of decimalPrice should be Promise', async function() {
    assert.typeOf(priceOracle.decimalPrice(baseCurrency, quoteCurrency), 'Object');
  });

});
