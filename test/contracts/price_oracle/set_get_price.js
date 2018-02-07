// Copyright 2017 OST.com Ltd.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//    http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.
//
// ----------------------------------------------------------------------------
// Test: set_get_price.js
//
// http://www.simpletoken.org/
//
// ----------------------------------------------------------------------------

const price_oracle_utils = require('./price_oracle_utils.js');

///
/// Test stories
/// 
/// fails to set price by non-ops
/// fails to set price to 0
/// successfully sets price
/// successfully gets price
/// fails to get price

module.exports.perform = (accounts) => {
  const opsAddress              = accounts[1],
        PRICE_VALIDITY_DURATION = 3;

  var response         = null;
  var price            = null;
  var expirationHeight = null;

  before(async () => {
    contracts   = await price_oracle_utils.deployPriceOracleMock(artifacts, accounts);
    priceOracle = contracts.priceOracle;
  });

  it('fails to set price by non-ops', async () => {
    await price_oracle_utils.utils.expectThrow(priceOracle.setPrice.call(1));
  });

  it('fails to set price to 0', async () => {
    await price_oracle_utils.utils.expectThrow(priceOracle.setPrice.call(0, { from: opsAddress }));
  });

  it('successfully sets price', async () => {
    price = 1;
    assert.ok(await priceOracle.setPrice.call(price, { from: opsAddress }));
    response = await priceOracle.setPrice(price, { from: opsAddress });
    expirationHeight = await priceOracle.expirationHeight.call();
    checkPriceUpdatedEvent(response.logs[0], price, expirationHeight);
    price_oracle_utils.utils.logResponse(response, 'PriceOracle.setPrice: ' + price);

    price = 2;
    assert.ok(await priceOracle.setPrice.call(price, { from: opsAddress }));
    response = await priceOracle.setPrice(price, { from: opsAddress });
    expirationHeight = await priceOracle.expirationHeight.call();
    checkPriceUpdatedEvent(response.logs[0], price, expirationHeight);
    price_oracle_utils.utils.logResponse(response, 'PriceOracle.setPrice: ' + price);
  });

  it('successfully gets price', async () => {
    for (var i = 0; i < PRICE_VALIDITY_DURATION; i++) {
      assert.equal(await priceOracle.getPrice.call(), price);
      response = await priceOracle.getPrice();
      assert.equal(response.logs.length, 0);
    }
  });

  it('fails to get price', async () => {
    // send before call in order to advance the block number before retrieving return for assertion
    response = await priceOracle.getPrice();
    assert.equal(await priceOracle.getPrice.call(), 0);
    assert.equal(response.logs.length, 1);
    checkPriceExpiredEvent(response.logs[0], expirationHeight);
    price_oracle_utils.utils.logResponse(response, 'PriceOracle.getPrice: invalid');
  });
}

function checkPriceUpdatedEvent(event, _price, _expirationHeight) {
  assert.equal(event.event, 'PriceUpdated');
  assert.equal(event.args._price, _price);
  assert.equal(event.args._expirationHeight.toNumber(), _expirationHeight.toNumber());
}

function checkPriceExpiredEvent(event, _expirationHeight) {
  assert.equal(event.event, 'PriceExpired');
  assert.equal(event.args._expirationHeight.toNumber(), _expirationHeight.toNumber());
}
