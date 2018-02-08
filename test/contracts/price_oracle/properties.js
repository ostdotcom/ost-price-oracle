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
// Test: properties.js
//
// http://www.simpletoken.org/
//
// ----------------------------------------------------------------------------

const priceOracleUtils = require('./price_oracle_utils.js');

///
/// Test stories
/// 
/// has decimals
/// has priceValidityDuration
/// has baseCurrency
/// has quoteCurrency

module.exports.perform = (accounts) => {
  const TOKEN_DECIMALS          = 18,
        PRICE_VALIDITY_DURATION = 18000,
        baseCurrency            = 'OST',
        quoteCurrency           = 'USD';

  before(async () => {
    contracts   = await priceOracleUtils.deployPriceOracle(artifacts, accounts);
    priceOracle = contracts.priceOracle;
  });

  it('has decimals', async () => {
    assert.equal((await priceOracle.decimals.call()).toNumber(), TOKEN_DECIMALS);
  });

  it('has priceValidityDuration', async () => {
    assert.equal((await priceOracle.priceValidityDuration.call()).toNumber(), PRICE_VALIDITY_DURATION);
  });

  it('has baseCurrency', async () => {
    assert.equal(web3.toAscii(await priceOracle.baseCurrency.call()), baseCurrency);
  });

  it('has quoteCurrency', async () => {
    assert.equal(web3.toAscii(await priceOracle.quoteCurrency.call()), quoteCurrency);
  });
}
