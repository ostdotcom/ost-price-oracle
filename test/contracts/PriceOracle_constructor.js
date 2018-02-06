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
// Test: PriceOracle_constructor.js
//
// http://www.simpletoken.org/
//
// ----------------------------------------------------------------------------

const PriceOracle_utils = require('./PriceOracle_utils.js');
const PriceOracle = artifacts.require('./PriceOracle.sol');

///
/// Test stories
/// 
/// fails to deploy if baseCurrency matches quoteCurrency

module.exports.perform = () => {
  it('fails to deploy if UUID is bad', async () => {
    await PriceOracle_utils.utils.expectThrow(PriceOracle.new('CUR', 'CUR'));
  });
}
