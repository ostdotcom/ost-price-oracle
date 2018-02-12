// Load external packages
const chai = require('chai')
  , assert = chai.assert;

const baseCurrency='OST'
  , quoteCurrency='USD'
;

// Load services
const rootPrefix = "../../.."
  , OSTPriceOracle = require(rootPrefix+'/index')
  , priceOracle = OSTPriceOracle.priceOracle
  , coreAddresses = require(rootPrefix + '/config/core_addresses')
  , contractAddr = coreAddresses.getAddressOfPriceOracleContract(baseCurrency, quoteCurrency)
  , logger = require(rootPrefix + '/helpers/custom_console_logger')
;

// quoteCurrency Service method unit tests
describe('quote Currency', function() {

  it('should fail when address is blank', async function() {
      var response = await priceOracle.getQuoteCurrency('');
      assert.equal(response.success, false);
  });

  it('should fail when both address is 0x', async function() {
      var response = await priceOracle.getQuoteCurrency('0x');
      assert.equal(response.success, false);
  });

  it('should match that response of quoteCurrency method should be Promise', async function() {
    assert.typeOf(priceOracle.getQuoteCurrency(contractAddr), 'promise');
  });

  it('should match set quoteCurrency', async function() {
    var response = await priceOracle.getQuoteCurrency(contractAddr);
    assert.equal(response.data.quoteCurrency, quoteCurrency);
  });
});
