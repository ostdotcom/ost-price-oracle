# Price Oracle - Price Oracle on top of the [OpenST network](https://ost.com)

[![Latest version](https://img.shields.io/npm/v/@ostdotcom/ost-price-oracle.svg?maxAge=3600)](https://www.npmjs.com/package/@ostdotcom/ost-price-oracle)
[![Travis](https://img.shields.io/travis/OpenSTFoundation/ost-price-oracle.svg?maxAge=600)](https://travis-ci.org/OpenSTFoundation/ost-price-oracle)
[![Downloads per month](https://img.shields.io/npm/dm/@ostdotcom/ost-price-oracle.svg?maxAge=3600)](https://www.npmjs.com/package/@ostdotcom/ost-price-oracle)

We caution that this is early stage software and under heavy ongoing development and improvement. Please report bugs and suggested improvements.

# Install OST Price Oracle

```bash
npm install @ostdotcom/ost-price-oracle --save
```

##### Constructor parameters:
There is 1 parameter required while creating the Price Oracle implementer.
* Parameter is mandatory and it specifies the configuration strategy to be used. An example of the configStrategy is: 
```js
const configStrategy = {
                   "OST_UTILITY_GETH_RPC_PROVIDER": "http://127.0.0.1:8545",
                   "OST_UTILITY_GETH_WS_PROVIDER": "ws://127.0.0.1:18545",
                   "OST_UTILITY_DEPLOYER_ADDR": "0xc363957f8cc55b38a2650666c15b15a7be766810", // An Address having balance
                   "OST_UTILITY_DEPLOYER_PASSPHRASE": "testtest",
                   "OST_UTILITY_OPS_ADDR": "0xebbbb2f7dbdf04936ac3ae4b4006e27c07857afb", // An Address having balance
                   "OST_UTILITY_OPS_PASSPHRASE": "testtest",
                   "OST_CACHING_ENGINE": "none",
                   "OST_UTILITY_PRICE_ORACLES": {
                     "OST": {
                       "USD": "0x9F4E47FeBcE32F8d85026fcD212D48aDd09Ea679"
                     }
                   }
                 };
```

### Run Deployment Script:
```bash
node tools/deploy/price_oracle.js OST USD 0x12A05F200
OST is baseCurrency
USD is quoteCurrency
```

### Set Caching Engine:
```bash
OST_CACHING_ENGINE='none'
For details refer - [OpenSTFoundation/ost-price-oracle](https://github.com/OpenSTFoundation/ost-price-oracle)
```

# Example:
```js

const OSTPriceOracle       = require('@ostdotcom/ost-price-oracle')
    , priceOracleInstance  = new OSTPriceOracle( configStrategy )
    , priceOracle          = priceOracleInstance.priceOracle
    ;
priceOracle.fixedPointIntegerPrice(0.5); // Returns Fixed Point Integer
priceOracle.setPrice(2000, 'OST','USD', 5000000000000000000, '0x12A05F200'); // Set Fixed point integer in Wei unit for a chain ID
priceOracle.getPrice(2000, 'OST', 'USD'); // Returns Fixed Point Integer Value for a chain ID
priceOracle.decimalPrice(2000, 'OST', 'USD'); // Returns Decimal Price for a chain ID
```