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
    try {
      await priceOracle.getQuoteCurrency('');
    } catch (e){
      assert.instanceOf(e, Error);
    }
  });

  it('should fail when both address is 0x', async function() {
    try {
      await priceOracle.getQuoteCurrency('0x');
    } catch (e){
      assert.instanceOf(e, Error);
    }
  });

  it('should match that response of quoteCurrency method should be Promise', async function() {
    assert.typeOf(priceOracle.getQuoteCurrency(contractAddr), 'Object');
  });

  it('should match set quoteCurrency', async function() {
    assert.equal((await priceOracle.getQuoteCurrency(contractAddr)).data.quoteCurrency, quoteCurrency);
  });
});
