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

// baseCurrency Service method unit tests
describe('base Currency', function() {

  it('should fail when contract address is blank', async function() {
      var response = await priceOracle.getBaseCurrency('');
      assert.equal(response.success, false);
  });

  it('should fail when contractAddress is 0x', async function() {
      var response = await priceOracle.getBaseCurrency('0x');
      assert.equal(response.success, false);
  });

  it('should match that response of baseCurrency method should be Promise', async function() {
    assert.typeOf(priceOracle.getBaseCurrency(contractAddr), 'promise');
  });

  it('should match set baseCurrency', async function() {
    var response = await priceOracle.getBaseCurrency(contractAddr);
    assert.equal(response.data.baseCurrency, baseCurrency);
  });
});
