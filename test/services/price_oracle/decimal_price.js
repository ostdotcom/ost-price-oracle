// Load external packages
const chai = require('chai')
  , assert = chai.assert;

// Load services
const rootPrefix          = "../../.."
    , OSTPriceOracle      = require( rootPrefix + '/index' )
    , configStrategy      = require( rootPrefix + "/tools/config_strategy.json" )
    , priceOracleObj      = new OSTPriceOracle( configStrategy )
    , priceOracle         = priceOracleObj.priceOracle
    , logger              = require(rootPrefix + '/helpers/custom_console_logger')
;

const baseCurrency='OST'
    , quoteCurrency='USD'
    , decimalPrice = parseFloat(process.env.OST_UTILITY_SET_PRICE)
    , chainId = parseInt(process.env.OST_UTILITY_CHAIN_ID)
;

// decimalPrice service method unit tests
describe('Get Price', function() {

  it('should fail when baseCurrency is blank', async function() {
    var response = await priceOracle.decimalPrice(chainId, '', quoteCurrency);
    assert.equal(response.success, false);
  });

  it('should fail when quoteCurrency is blank', async function() {
    var response  = await priceOracle.decimalPrice(chainId, baseCurrency, '');
    assert.equal(response.success, false);
  });

  it('should fail when both baseCurrency and quoteCurrency is blank', async function() {
    var response = await priceOracle.decimalPrice(chainId, '', '');
    assert.equal(response.success, false);
  });

  it('should match price in decimal value', async function() {
    var response  = await priceOracle.decimalPrice(chainId, baseCurrency, quoteCurrency);
    assert.equal(parseFloat(response.data.price), decimalPrice);
  });

  it('should match that response of decimalPrice should be Promise', async function() {
    assert.typeOf(priceOracle.decimalPrice(chainId, baseCurrency, quoteCurrency), 'promise');
  });

});
