## Price Oracle

### Overview

- Build smart contracts which sets base currency and quote currency as currency pairs.

- A price oracle should return daily base currency Vs quote currency conversion value.

### Specifications

- The {quoteCurrency}/{baseCurrency} price is expected to be derived from tracking each asset's trading across all exchanges globally.

- For different {quoteCurrency}/{baseCurrency} there will be different deployed instances of PriceOracle contract.

- Frequency of populating {quoteCurrency}/{baseCurrency} value depends on the consumer of contract. It will be configurable.

- The price population work will be done by the developer or company. Cost(gas) of populating prices will be borne by respective developer/company.

- The contract is opsManaged. Since there will be automated process(cron) to populate the price points, machine key will need gas to populate price points.


### Price Precision

- Solidity doesn't support storing decimal values, Prices will be stored as fixed point integer similar as wei unit.
  e.g. if OST = 2.5 USD, it will be stored as 2.5 * 10^18 = 25 * 10^17
  decimal function is provided to assist the app in setting the price and to assist consuming contracts/applications to understand the price.


### Price Expiration

- PRICE_VALIDITY_DURATION constant is set in block numbers which is equivalent number of blocks estimated in hours.

- There is a price expiration duration function priceValidityDuration which is set to the equivalent number of blocks estimated to equal 25 hours.

- whenever price is set, expiration height is updated, PriceUpdated event is emitted. PriceExpired event is emitted, when the contract learns that the price has expired.

