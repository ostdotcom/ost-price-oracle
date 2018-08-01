// Load external packages
const chai = require('chai')
  , assert = chai.assert;

// Load services
const rootPrefix          = "../../.."
    , configStrategy      = require( rootPrefix + "/tools/config_strategy.json" )
    , OSTPriceOracle      = require(rootPrefix+'/index')
    , priceOracleObj      = new OSTPriceOracle( configStrategy )
    , priceOracle         = priceOracleObj.priceOracle
    , ic                  = priceOracleObj.ic()
    , BigNumber           = require('bignumber.js')
;

require(rootPrefix + '/lib/web3/providers/factory');

const web3ProviderFactory = ic.getWeb3ProviderFactory()
    , web3Provider        = web3ProviderFactory.getProvider('ws')
;

const baseCurrency='OST'
  , quoteCurrency='USD'
  , decimalPrice = parseFloat(process.env.OST_UTILITY_SET_PRICE)
  , price = new BigNumber(web3Provider.utils.toWei(decimalPrice.toString(), "ether")).toNumber()
  , chainId = parseInt(process.env.OST_UTILITY_CHAIN_ID)
;

// getPrice service method unit tests
describe('Get Price', function() {

  it('should fail when baseCurrency is blank', async function() {
      var response =  await priceOracle.getPrice(chainId, '', quoteCurrency);
  });

  it('should fail when quoteCurrency is blank', async function() {
      var response = await priceOracle.getPrice(chainId, baseCurrency, '');
      assert.equal(response.success, false);
  });

  it('should fail when both baseCurrency and quoteCurrency is blank', async function() {
      var response = await priceOracle.getPrice(chainId, '', '');
      assert.equal(response.success, false);
  });

  it('should match setPrice equals getPrice', async function() {
    var response  = await priceOracle.getPrice(chainId, baseCurrency, quoteCurrency);
    assert.equal(price, response.data.price);
  });

  it('should match that response of getPrice should be Promise', async function() {
    assert.typeOf(priceOracle.getPrice(chainId, baseCurrency, quoteCurrency), 'promise');
  });

  it('should validate that response of getPrice should be fixed point integer', async function() {
    var response  = await priceOracle.getPrice(chainId, baseCurrency, quoteCurrency);
    var price = response.data.price;
    assert.equal(price%1, 0);
  });


});
