pragma solidity ^0.4.17;

// Copyright 2017 OpenST Ltd.
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
// Utility Chain: PriceOracleInterface
//
// http://www.simpletoken.org/
//
// --------------------------
// This contract keeps in storage an updated baseCurrency/quoteCurrency price,
// which is updated in a particular duration.
// There is an expiry duration for a currency pair
//
contract PriceOracleInterface{

    /*
     *  Events
     */

    @dev event emitted when price is updated
    event PriceOracleUpdated(uint256 _price,
                             uint256 _expirationHeight);
    @dev event emitted when price expires
    event PriceExpired(uint256 _expirationHeight);

    // @dev Price is stored as fixed point integer value similar as wei unit.
    // Use this variable in case decimal value need to be evaluated
    uint8 public constant TOKEN_DECIMALS = 18;

    /*
     * Functions
     */

    // @dev use this function to update price
    function setPrice(
        uint256 _price)
        external
        returns(
        uint256 expirationHeight);

    // @dev use this function to get price
    function getPrice()
        public
        returns (
        uint256 price);

}