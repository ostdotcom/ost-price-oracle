/* solhint-disable-next-line compiler-fixed */
pragma solidity ^0.4.17;

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
// Utility Chain: PriceOracleMock
//
// http://www.simpletoken.org/
//
// --------------------------

import "./PriceOracle.sol";


/// @title PriceOracleMock - Overrides certain getters to ease testing PriceOracle
contract PriceOracleMock is PriceOracle {
    /// mock block expiry duration private constant variable
    uint256 private constant PRICE_VALIDITY_DURATION = 3;

    /// @dev Takes _baseCurrency, _quoteCurrency
    /// @param _baseCurrency base currency
    /// @param _quoteCurrency quote currency
    constructor(
        bytes3 _baseCurrency,
        bytes3 _quoteCurrency)
        public
        PriceOracle(
        _baseCurrency,
        _quoteCurrency)
        { }

    /// @dev Returns mock PRICE_VALIDITY_DURATION
    /// @return price validity duration
    function priceValidityDuration()
        public
        view
        returns(
        uint256 /* price validity duration */)
    {
        return PRICE_VALIDITY_DURATION;
    }
}