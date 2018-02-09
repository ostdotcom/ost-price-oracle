// Load external packages
const chai = require('chai')
  , assert = chai.assert
  ;

// Load services
const rootPrefix = "../../.."
  , OSTPriceOracle = require(rootPrefix+'/index')
  , priceOracle = OSTPriceOracle.priceOracle
  , logger = require(rootPrefix + '/helpers/custom_console_logger')
  , Utils = require(rootPrefix+'/test/lib/utils')
;

const baseCurrency='OST'
  , quoteCurrency='USD'
  , decimalPrecision = 18
;

// Decimals precision service method unit tests
describe('Decimal Precision', function() {

  it('should fail when baseCurrency is blank', async function() {
    try {
      await priceOracle.decimals('', quoteCurrency);
    } catch (e){
      assert.instanceOf(e, TypeError);
    }
  });

  it('should fail when quoteCurrency is blank', async function() {
    try {
      await priceOracle.decimals(baseCurrency, '');
    } catch (e){
      assert.instanceOf(e, Error);
    }
  });

  it('should fail when both baseCurrency and quoteCurrency is blank', async function() {
    try {
      await priceOracle.decimals('', '');
    } catch (e){
      assert.instanceOf(e, TypeError);
    }
  });

  it('should match that response of decimals method should be Promise', async function() {
    assert.typeOf(priceOracle.decimals(baseCurrency, quoteCurrency), 'Object');
  });

  it('should match decimal precision value', async function() {
    assert.equal((await priceOracle.decimals(baseCurrency, quoteCurrency)).data.decimals, decimalPrecision);
  });
});
