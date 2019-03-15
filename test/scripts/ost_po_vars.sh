# Price Oracle variables
export OST_AUX_GETH_RPC_PROVIDER='http://127.0.0.1:8545'
export OST_AUX_GETH_WS_PROVIDER='ws://127.0.0.1:18545'

export OST_AUX_OWNER_ADDR='0xAb61FEa23744DA08A711B5B53c272ef192053bF3'
export OST_AUX_OWNER_PVT_KEY='008d022f7980d780d8b07a251a4ec580db77ec8f44878a8ebacb0d8f94229d67'
export OST_AUX_OWNER_PASSPHRASE='testtest'

export OST_AUX_ADMIN_ADDR='0xe46bdE0D30A13F20eE8d7Dc296A75aAFb1f5DCcD'
export OST_AUX_ADMIN_PVT_KEY='0ba743e9f2e00b5f37418226ddf31955dfd215f175eeb879685cb65e4cf57e90'
export OST_AUX_ADMIN_PASSPHRASE='testtest'

export OST_AUX_OPS_ADDR='0xDd69351ecc0011f8885fdd2d3a664b905746eF5e'
export OST_AUX_OPS_PVT_KEY='119d1d3f611153492300afcb3a24d2324ffd997d2bff3ab96230045175121d7f'
export OST_AUX_OPS_PASSPHRASE='testtest'

# Only for test scripts
export OST_AUX_SET_PRICE=0.5
export OST_AUX_CHAIN_ID=2001

# Cache related configurations
export OST_DEFAULT_TTL='60'
export OST_CACHING_ENGINE='redis'
export OST_REDIS_HOST='localhost'
export OST_REDIS_PORT='6380'
export OST_REDIS_PASS='my-secret'
export OST_REDIS_TLS_ENABLED='0'