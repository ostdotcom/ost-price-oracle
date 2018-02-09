// Load external packages
const chai = require('chai')
  , assert = chai.assert
  , BigNumber = require('bignumber.js')
;

// Load services
const rootPrefix = "../../.."
  , OSTPriceOracle = require(rootPrefix+'/index')
  , priceOracle = OSTPriceOracle.priceOracle
  , web3RpcProvider = require(rootPrefix + '/lib/web3/providers/rpc')
  , logger = require(rootPrefix + '/helpers/custom_console_logger')
;

const baseCurrency= 'OST'
  , quoteCurrency= 'USD'
  , decimalPrice = parseFloat(process.env.OST_PO_SET_PRICE)
  , price = new BigNumber(web3RpcProvider.utils.toWei(decimalPrice.toString(), "ether")).toNumber()
  , gasPrice = '0x12A05F200'
  , priceValidityDuration = (25*60*60)/5 // 25 hours at 5 seconds per block
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

  it('should match contract getExpirationHeight response datatype', async function() {
    assert.typeOf(await priceOracle.getExpirationHeight(baseCurrency, quoteCurrency), 'number');
  });

  it('should make a transaction and match getExpirationHeight', async function() {
    this.timeout(100000);
    var blockNumber = await web3RpcProvider.eth.getBlockNumber();
    await priceOracle.setPriceInSync(baseCurrency, quoteCurrency, price, gasPrice);
    var updatedBlockNumber = await priceOracle.getExpirationHeight(baseCurrency, quoteCurrency);
    // updatedBlockNumber is greater than or equal to
    // greaterThan because mining could be happening frequently
    assert.isAtLeast(updatedBlockNumber, blockNumber+priceValidityDuration);
  });


});
