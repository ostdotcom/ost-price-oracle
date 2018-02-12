// Load external packages
const chai = require('chai')
  , assert = chai.assert
  , BigNumber = require('bignumber.js')
  , openSTCache = require('@openstfoundation/openst-cache')
  , cacheImplementer = openSTCache.cache
;
;

// Load services
const rootPrefix = "../../.."
  , OSTPriceOracle = require(rootPrefix+'/index')
  , priceOracle = OSTPriceOracle.priceOracle
  , web3RpcProvider = require(rootPrefix + '/lib/web3/providers/rpc')
  , logger = require(rootPrefix + '/helpers/custom_console_logger')
  , helper = require(rootPrefix+'/lib/contract_interact/helper')
  , coreAddresses = require(rootPrefix + '/config/core_addresses')
;

const baseCurrency= 'OST'
  , quoteCurrency= 'USD'
  , decimalPrice = parseFloat(process.env.OST_UTILITY_SET_PRICE)
  , price = new BigNumber(web3RpcProvider.utils.toWei(decimalPrice.toString(), "ether")).toNumber()
  , gasPrice = '0x12A05F200'
  , priceValidityDuration = (25*60*60)/5 // 25 hours at 5 seconds per block
  , chainId = parseInt(process.env.OST_UTILITY_CHAIN_ID)
  , contractAddress = coreAddresses.getAddressOfPriceOracleContract(baseCurrency, quoteCurrency)
;



// getExpirationHeight Service method unit tests
describe('expiration height', function() {

  it('should fail when baseCurrency is blank', async function() {
      var response = await priceOracle.getExpirationHeight(chainId, undefined, quoteCurrency);
      assert.equal(response.success, false);
  });

  it('should fail when quoteCurrency is blank', async function() {
      var response = await priceOracle.getExpirationHeight(chainId, baseCurrency,'');
      assert.equal(response.success, false);
  });

  it('should fail when both baseCurrency and quoteCurrency is blank', async function() {
      var response = await priceOracle.getExpirationHeight(chainId, '','');
      assert.equal(response.success, false);
  });

  it('should match that response of baseCurrency method should be Promise', async function() {
    assert.typeOf(priceOracle.getExpirationHeight(chainId, baseCurrency, quoteCurrency), 'promise');
  });

  it('should match contract getExpirationHeight response datatype', async function() {
    var response = await priceOracle.getExpirationHeight(chainId, baseCurrency, quoteCurrency);
    assert.typeOf(response.data.expirationHeight, 'number');
  });

  it('should make a transaction and match getExpirationHeight', async function() {
    this.timeout(100000);
    // Delete expirationHeight cache
    cacheImplementer.del(helper.oracleExpirationHeightKey(chainId, contractAddress));
    var blockNumber = await web3RpcProvider.eth.getBlockNumber();
    await priceOracle.setPriceInSync(chainId, baseCurrency, quoteCurrency, price, gasPrice);
    var response = await priceOracle.getExpirationHeight(chainId, baseCurrency, quoteCurrency);
    // updatedBlockNumber is greater than or equal to
    // greaterThan because mining could be happening frequently
    // It will not be true if expiration height is coming from cache
    // So we are clearing cache above
    assert.isAtLeast(response.data.expirationHeight, blockNumber+priceValidityDuration);
  });


});
