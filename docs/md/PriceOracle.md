## Price Oracle

### Overview

- Build smart contracts which sets base currency and quote currency as currency pairs.
- These price oracle should return daily base currency Vs quote currency conversion.

### Specifications

- The {baseCurrency}/{quoteCurrency} price is derived from tracking each asset's trading across all exchanges globally.

- For different {baseCurrency}/{quoteCurrency}there will be different deployed instances of PriceOracle contract.

- Frequency of populating {baseCurrency}/{quoteCurrency} value depends on the consumer of contract. It will be configurable.

- The price population work will be done by the consumer developer/company. Cost(gas) of populating prices will be beared by respective developer/company.

- The contract is opsManaged. Since there will be automated process(cron) to populate the price points, machine key will have access to populate the price points.


### Price Precision

- Since solidity doesn't support storing decimal values, Prices will be stored as fixed point integer similar as wei unit.
  e.g. if OST = 2.5 USD, it will be stored as 2.5 * 10^18 = 25 * 10^17

- There is public variable TOKEN_DECIMALS exposed which is not used inside the contract. Consumer of the contract can use the variable
  in case they need the value in decimal value.
  e.g. (25 * 10^17) / (25 * 10^18) = 2.5

### Price Expiration

- There is a price expiration duration variable PRICE_VALIDITY_DURATION which is set for

