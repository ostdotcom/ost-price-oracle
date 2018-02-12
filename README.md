# Price Oracle - Price Oracle on top of the [OpenST network](https://simpletoken.org)

[![Gitter: JOIN CHAT](https://img.shields.io/badge/gitter-JOIN%20CHAT-brightgreen.svg)](https://gitter.im/OpenSTFoundation/SimpleToken)

We caution that this is early stage software and under heavy ongoing development and improvement. Please report bugs and suggested improvements.

# Install OST Price Oracle

```bash
npm install @ostdotcom/ost-price-oracle --save
```

# Set EVN Variables

### Select the desired caching engine and default TTL:
```bash
export OST_PO_GETH_RPC_PROVIDER='http://127.0.0.1:8545'
export OST_PO_DEPLOYER_ADDR='0xa4ff1bb9d240921e2c4ebf2ec7e62d90714ec2d1' # An Address having balance
export OST_PO_DEPLOYER_PASSPHRASE='testtest' # deployer passphrase
export OST_PO_OPS_ADDR='0xbd0a2ae58648a2c39238ea4da56954502398b1cb' # An Address having balance
export OST_PO_OPS_PASSPHRASE='testtest' # deployer passphrase
export OST_PO_PRICE_ORACLES='{}' # set blank object so that JSON.parse doesn't break
```

### Run Deployment Script:
```bash
node tools/deploy/price_oracle.js OST USD 0x12A05F200
OST is baseCurrency
USD is quoteCurrency
```

### export price oracles:
```bash
export OST_PO_PRICE_ORACLES='{"OST":{"USD":"0x2f00d4220d4B119e7f477C178bEd5932492eE3dF"}}'
```

# Example:
```js
const OSTPriceOracle = require('@ostdotcom/ost-price-oracle')
  , priceOracle = OSTPriceOracle.priceOracle;
priceOracle.fixedPointIntegerPrice(0.5); // Returns Fixed Point Integer
priceOracle.setPrice(2000, 'OST','USD', 5000000000000000000, '0x12A05F200'); // Set Fixed point integer in Wei unit
priceOracle.getPrice(2000, 'OST', 'USD'); // Returns Fixed Point Integer Value
priceOracle.decimalPrice(2000, 'OST', 'USD'); // Returns Decimal Price
```