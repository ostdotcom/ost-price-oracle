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
export OST_DEPLOYER_ADDR='0x6e3c0513c23580935cc22bd27e7a66a9e6906994' # An Address having balance
export OST_DEPLOYER_PASSPHRASE='testtest' # deployer passphrase
```

### Run Deployment Script:
```bash
node tools/deploy/price_oracle.js OST USD
OST is baseCurrency
USD is quoteCurrency
```

### export price oracle contract address:
```bash
export OST_PRICE_ORACLE_CONTRACT_ADDR='0x25A917522C3D54Ca90660664BdCe2c22362efD4a' # Contract Address
```

# Example:
```js
const OSTPriceOracle = require('ost-price-oracle')
  , priceOracle = OSTPriceOracle.priceOracle;
priceOracle.getPrice();
priceOracle.setPrice(500000000000000000); // Fixed point integer in wei unit
```