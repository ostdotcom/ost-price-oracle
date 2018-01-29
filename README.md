# Price Oracle - Price Oracle on top of the [OpenST network](https://simpletoken.org)

[![Gitter: JOIN CHAT](https://img.shields.io/badge/gitter-JOIN%20CHAT-brightgreen.svg)](https://gitter.im/OpenSTFoundation/SimpleToken)

We caution that this is early stage software and under heavy ongoing development and improvement. Please report bugs and suggested improvements.

# Install OST Price Oracle

```bash
npm install @openstfoundation/ost-price-oracle --save
```

# Set EVN Variables

### Select the desired caching engine and default TTL:
```bash
export OST_GAS_PRICE='0x12A05F200' # 5 Gwei
export OST_GAS_LIMIT=4700000 # Gas Limit
export OST_GETH_RPC_PROVIDER='http://127.0.0.1:8545'
export OST_DEPLOYER_ADDR='0xa4ff1bb9d240921e2c4ebf2ec7e62d90714ec2d1' # An Address having balance
export OST_DEPLOYER_PASSPHRASE='testtest' # deployer passphrase
export OST_OPS_ADDR='0xbd0a2ae58648a2c39238ea4da56954502398b1cb' # An Address having balance
export OST_OPS_PASSPHRASE='testtest' # deployer passphrase
export OST_PRICE_ORACLES='{}' # blank object so that JSON.parse doesn't break
```

### Run Deployment Script:
```bash
node tools/deploy/price_oracle.js OST USD
OST is baseCurrency
USD is quoteCurrency
```

### export price oracles:
```bash
export OST_PRICE_ORACLES='{"OST":{"USD":"0x13626bF307E0629dfF0bc800B07d8DbBEdBaB08C"}}'
```

# Example:
```js
const OSTPriceOracle = require('ost-price-oracle')
  , priceOracle = OSTPriceOracle.priceOracle;
priceOracle.getPrice('OST', 'USD');
priceOracle.setPrice('OST','USD',5000000000000000000); // Fixed point integer in wei unit
```