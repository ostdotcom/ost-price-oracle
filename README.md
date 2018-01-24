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
export OST_GAS_LIMIT=0xBA43B7400 # 50 Gwei
export OST_GETH_RPC_PROVIDER='http://127.0.0.1:8545'
export OST_GETH_WS_PROVIDER='ws://127.0.0.1:18545' 
export OST_CHAIN_ID=2000 # Chain ID
export OST_DEPLOYER_ADDR='' # An Address having balance
export OST_DEPLOYER_PASSPHRASE='test' # deployer passphrase
```

### Run Deployment Script:
```bash
node tools/deploy/price_oracle.js OST USD
OST is baseCurrency
USD is quoteCurrency
```

### export price oracle contract address:
```bash
export OST_PRICE_ORACLE_CONTRACT_ADDR='' # Contract Address
```

# Example:
```js
const OSTPriceOracle = require('@openstfoundation/ost-price-oracle')
  , priceOracle = OSTPriceOracle.priceOracle;
priceOracle.getPrice();
priceOracle.setPrice(64738390202020981); // Fixed point integer
```