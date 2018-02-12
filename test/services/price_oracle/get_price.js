// Load external packages
const chai = require('chai')
  , assert = chai.assert;

// Load services
const rootPrefix = "../../.."
  , OSTPriceOracle = require(rootPrefix+'/index')
  , priceOracle = OSTPriceOracle.priceOracle
  , web3RpcProvider = require(rootPrefix+'/lib/web3/providers/rpc')
  , BigNumber = require('bignumber.js')
;

const baseCurrency='OST'
  , quoteCurrency='USD'
  , decimalPrice = parseFloat(process.env.OST_PO_SET_PRICE)
  , price = new BigNumber(web3RpcProvider.utils.toWei(decimalPrice.toString(), "ether")).toNumber()
  , chainId = parseInt(process.env.OST_PO_CHAIN_ID)
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
