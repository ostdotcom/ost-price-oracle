## Price Oracle

### Overview

- Build smart contracts which sets base currency and quote currency as currency pairs.
- These price oracle should return daily base currency Vs quote currency conversion value.

### Specifications

- The {quoteCurrency}/{baseCurrency} price is derived from tracking each asset's trading across all exchanges globally.

- For different {quoteCurrency}/{baseCurrency} there will be different deployed instances of PriceOracle contract.

- Frequency of populating {quoteCurrency}/{baseCurrency} value depends on the consumer of contract. It will be configurable.

- The price population work will be done by the developer or company. Cost(gas) of populating prices will be beared by respective developer/company.

- The contract is opsManaged. Since there will be automated process(cron) to populate the price points, machine key will need gas to populate price points.


### Price Precision

- Solidity doesn't support storing decimal values, Prices will be stored as fixed point integer similar as wei unit.
  e.g. if OST = 2.5 USD, it will be stored as 2.5 * 10^18 = 25 * 10^17

- There is public variable TOKEN_DECIMALS exposed which is not used inside the contract. Consumer of the contract can use the variable
  in case they need the value in decimal value.
  e.g. (25 * 10^17) / (25 * 10^18) = 2.5

### Price Expiration

- There is a price expiration duration variable PRICE_VALIDITY_DURATION which is set equivalent to block number equal to duration in hours.

- whenever price is set, expiration height is increased. When price is expired, PriceExpired event is emitted.

