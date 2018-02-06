// Load external packages
const chai = require('chai')
  , assert = chai.assert;

// Load services
const rootPrefix = "../../.."
  , OSTPriceOracle = require(rootPrefix+'/index')
  , priceOracle = OSTPriceOracle.priceOracle
  , logger = require(rootPrefix + '/helpers/custom_console_logger')
;

const baseCurrency= 'OST'
  , quoteCurrency= 'USD'
  , expirationHeight = (25*60*60)/5 // 25 hours at 5 seconds per block
;

// getExpirationHeight Service method unit tests
describe('expiration height', function() {

  it('should fail when baseCurrency is blank', async function() {
    try {
      await priceOracle.getExpirationHeight('', quoteCurrency);
    } catch (e){
      assert.instanceOf(e, TypeError);
    }
  });

  it('should fail when quoteCurrency is blank', async function() {
    try {
      await priceOracle.getExpirationHeight(baseCurrency,'');
    } catch (e){
      assert.instanceOf(e, Error);
    }
  });

  it('should fail when both baseCurrency and quoteCurrency is blank', async function() {
    try {
      await priceOracle.getExpirationHeight('','');
    } catch (e){
      assert.instanceOf(e, TypeError);
    }
  });

  it('should match that response of baseCurrency method should be Promise', async function() {
    assert.typeOf(priceOracle.getExpirationHeight(baseCurrency, quoteCurrency), 'Object');
  });

  it('should match contract ExpirationHeight', async function() {
    console.log(await priceOracle.getExpirationHeight(baseCurrency, quoteCurrency));
    assert.typeOf(await priceOracle.getExpirationHeight(baseCurrency, quoteCurrency), 'number');
  });
});
