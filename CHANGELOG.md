## ost-price-oracle v1.0.7
- Upgraded node version to 10.x
- Version bump for dependencies.

## ost-price-oracle v1.0.6
- Migrated to ES6.
- Migrated repository from OpenST Foundation to OST organization.

## ost-price-oracle v1.0.5
- Support for multi utility chain is added.
- Environment variables were a hard dependency. The flexibility of creating two different instances of price oracle was not 
  possible For Example: If an application wants to interact with multiple utility chains. With environment variables 
  they could only interact with the one set in the variables. Interacting with multiple utility chains was not possible.
  To achieve this flexibility, we now take configuration as OST Price Oracle constructor params and then use the config 
  in place of environment variables, where-ever needed. This allows price oracle  to connect to a configured set of services - Redis , Memcache, Geth. 
  After this change the application using OST Price Oracle will create different configurations, instantiate price oracle for 
  each configuration and then communicate with respective (appropriate) price oracle instance. 
- Common style guide followed across all OST repos using prettier.

## ost-price-oracle v1.0.2
- Solidity/solc is upgraded to 0.4.23. All contracts compile warnings are handled and contracts are upgraded with latest syntax. 
- Truffle package is upgraded to 4.1.8.
- New response helper integration. Standardized error codes are now being used in OST Price Oracle.
- OST Base web3 integration. Web socket connection to geth is now being used and preferred over RPC connection.
- OST Base integration with logger is done.
- Loggers updated from into to debug wherever necessary. Log level support was introduced and non-important logs were moved to debug log level.

## ost-price-oracle v1.0.1
- Support for web socket is added.
- Geth version updated to 1.0.0-beta.33.

## ost-price-oracle v1.0.0
- OST Price Oracle 1.0.0 is the first release of ost-price-oracle. It provides `PriceOracle` contract which accepts and exposes a price for a certain base currency in a certain quote currency.
