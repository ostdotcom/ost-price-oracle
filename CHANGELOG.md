## ost-price-oracle v1.0.4-beta.1 (1 August 2018)

Changelog:

- Support for multi chain is added.
- Deployment process updated.

## ost-price-oracle v1.0.2 (17 May 2018)

Changelog:

- Solidity/solc is upgraded to 0.4.23. All contracts compile warnings are handled and contracts are upgraded with latest syntax. 
- Truffle package is upgraded to 4.1.8.
- New response helper integration. Standardized error codes are now being used in OST Price Oracle.
- OpenST base web3 integration. Web socket connection to geth is now being used and preferred over RPC connection.
- OpenST base integration with logger is done.
- Loggers updated from into to debug wherever necessary. Log level support was introduced and non-important logs were moved to debug log level.

## ost-price-oracle v1.0.1 (29 March 2018)

Changelog:

- Support for web socket is added.
- Geth version updated to 1.0.0-beta.33.

## ost-price-oracle v1.0.0 (14 March 2018)

OST Price Oracle 1.0.0 is the first release of ost-price-oracle. It provides `PriceOracle` contract which accepts and exposes a price for a certain base currency in a certain quote currency.
