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
// Utility Chain: PriceOracle
//
// http://www.simpletoken.org/
//
// --------------------------
// This contract keeps in storage an updated quoteCurrency/baseCurrency price,
// which is updated in a particular duration.
// There is an expiry duration for a currency pair
//

import "./PriceOracleInterface.sol";
import "./OpsManaged.sol";

contract PriceOracle is OpsManaged, PriceOracleInterface{

    /*
     *  Events
     */

    /// @dev event emitted whenever price is updated
    /// @return _price
    /// @return _expirationHeight
    event PriceOracleUpdated(uint256 _price, uint256 _expirationHeight);

    /// @dev event emitted when price expires
    /// @return _expirationHeight
    event PriceExpired(uint256 _expirationHeight);

    /*
     *  Constants
     */

    /// Block expiry duration public constant variable
    uint256 public constant PRICE_VALIDITY_DURATION = 18000; // 25 hours at 5 seconds per block

    /*
     *  Storage
     */

    /// Private variable price
    uint256 private price;
    /// blockheight at which the price expires
    uint256 public expirationHeight;
    /// specifies the base currency value e.g. "OST"
    bytes3 public baseCurrency;
    /// specifies the quote Currency value "USD", "EUR", "ETH", "BTC"
    bytes3 public quoteCurrency;

    /*
     *  Public functions
     */

    /// @dev constructor function
    ///
    /// @param _baseCurrency baseCurrency
    /// @param _quoteCurrency quoteCurrency
    function PriceOracle(
        bytes3 _baseCurrency,
        bytes3 _quoteCurrency
        )
        public
        OpsManaged()
    {
        // Initialize quote currency
        quoteCurrency = _quoteCurrency;
        // Initialize base currency
        baseCurrency = _baseCurrency;
    }

    /// @dev use this method to set price
    ///
    /// @param _price price
    /// @return expirationHeight
    function setPrice(
        uint256 _price)
        external
        onlyOps
        returns(
        uint256 /* expirationHeight */)
    {
        // Validate if _price is greater than 0
        require(_price > 0);

        // Assign the new value
        price = _price;

        // update the expiration height
        expirationHeight = block.number + PRICE_VALIDITY_DURATION;

        // Event Emitted
        PriceOracleUpdated(_price, expirationHeight);

        // Return
        return (expirationHeight);
    }

    /// @dev use this function to get quoteCurrency/baseCurrency value
    ///
    /// @return price
    function getPrice()
        public
        returns (
        uint256 /* price */  )
    {
        // Current Block Number should be less than expiration height
        // Emit an event if Price Point expires
        if (block.number > expirationHeight){
            // Emit invalid price event
            PriceExpired(expirationHeight);

            // Return 0 so that call of this method from inside a contract can handle the error case
            return (0);
        }

        // Return current price
        return (price);
    }

}