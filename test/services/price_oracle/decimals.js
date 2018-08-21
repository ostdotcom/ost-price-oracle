// Load external packages
const chai = require('chai')
  , assert = chai.assert
  ;

// Load services
const rootPrefix          = "../../.."
    , OSTPriceOracle      = require(rootPrefix+'/index')
    , configStrategy      = require( rootPrefix + "/tools/config_strategy.json" )
    , priceOracleObj      = new OSTPriceOracle( configStrategy )
    , priceOracle         = priceOracleObj.priceOracle
    , logger              = require(rootPrefix + '/helpers/custom_console_logger')
    , Utils               = require(rootPrefix+'/test/lib/utils')
;

const baseCurrency='OST'
  , quoteCurrency='USD'
  , decimalPrecision = 18
;

// Decimals precision service method unit tests
describe('Decimal Precision', function() {

  it('should fail when baseCurrency is blank', async function() {
      var response = await priceOracle.decimals('', quoteCurrency);
      assert.equal(response.success, false);
  });

  it('should fail when quoteCurrency is blank', async function() {
      var response = await priceOracle.decimals(baseCurrency, '');
      assert.equal(response.success, false);
  });

  it('should fail when both baseCurrency and quoteCurrency is blank', async function() {
      var response = await priceOracle.decimals('', '');
      assert.equal(response.success, false);
  });

  it('should match that response of decimals method should be Promise', async function() {
    assert.typeOf(priceOracle.decimals(baseCurrency, quoteCurrency), 'promise');
  });

  it('should match decimal precision value', async function() {
    var response = await priceOracle.decimals(baseCurrency, quoteCurrency);
    assert.equal(response.data.decimals, decimalPrecision);
  });
});
